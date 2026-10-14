// File: script.js

const QUESTION_PRIORITY_IDS = [125, 105, 104, 103, 102, 101, 100, 96, 95, 93, 92];
const RENDER_SLICE_MS = 8;
const OPTION_LETTERS = ['a', 'b', 'c', 'd'];
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyDNv4-5NA-WzEyJBA8l-LanRQRt9VsGddknPKMQBA8RIzxTUE9yd5wwAqgik5BT8oc/exec';
const ATTEMPT_QUEUE_KEY = 'nlkt.pendingAttempts.v1';
const LEARNER_ID_KEY = 'nlkt.learnerId.v1';

const ui = {
    timerBox: document.getElementById('timer-box'),
    timeRemaining: document.getElementById('time-remaining'),
    submitButtons: [
        document.getElementById('submit-button'),
        document.getElementById('submit-button-bottom')
    ],
    questionTools: document.getElementById('question-tools'),
    questionSelect: document.getElementById('question-select'),
    questionContainer: document.getElementById('question-container'),
    metaTotal: document.getElementById('meta-total'),
    metaAnswered: document.getElementById('meta-answered'),
    metaScore: document.getElementById('meta-score'),
    resultsModal: document.getElementById('results-modal'),
    resultText: document.getElementById('result-text'),
    resultAnalysis: document.getElementById('result-analysis'),
    historyModal: document.getElementById('history-modal'),
    historyContent: document.getElementById('history-content'),
    syncStatus: document.getElementById('sync-status')
};

let activeQuizData = [];
let userAnswers = [];
let answeredCount = 0;
let correctCount = 0;
let isExamMode = false;
let isReviewingExam = false;
let timerTimeout = null;
let timerDeadline = 0;
let timeLeft = 60 * 60;
let renderGeneration = 0;
let pendingRenderFrame = 0;
let sessionId = null;
let sessionStartedAt = 0;
let sessionMode = '';
let idleSyncHandle = null;
let isSyncingAttempts = false;
let memoryAttemptQueue = [];
let historyRequestSequence = 0;
let lastSubmittedAttempt = null;
let historyVisibleCount = 5;
let historySavedAttempts = [];
let historyPendingAttempts = [];
let historyStatusMessage = '';

const questionBank = typeof quizData !== 'undefined' && Array.isArray(quizData)
    ? quizData
    : [];

// Delegate option clicks to the question list instead of allocating one listener per option.
ui.questionContainer?.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const option = target.closest('.quiz-option');
    if (!option || option.disabled || !ui.questionContainer.contains(option)) return;

    const card = option.closest('.quiz-question');
    if (!card) return;

    const questionIndex = Number.parseInt(card.dataset.questionIndex, 10);
    const optionIndex = Number.parseInt(option.dataset.optionIndex, 10);
    if (Number.isInteger(questionIndex) && Number.isInteger(optionIndex)) {
        selectAnswer(questionIndex, optionIndex);
    }
});

// Shuffle a copy so the source question bank remains unchanged.
function shuffleArray(items) {
    const shuffled = items.slice();

    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const item = shuffled[index];
        shuffled[index] = shuffled[swapIndex];
        shuffled[swapIndex] = item;
    }

    return shuffled;
}

// Reuse the immutable question objects; only the order changes between attempts.
function prepareQuizData(isRandom = false, subsetCount = null, priorityIds = [], priorityCount = 0) {
    let questions = isRandom ? shuffleArray(questionBank) : questionBank.slice();

    if (subsetCount && subsetCount < questions.length) {
        if (priorityIds.length > 0 && priorityCount > 0) {
            const prioritySet = new Set(priorityIds);
            const priorityPool = questionBank.filter(question => prioritySet.has(question.id));
            const otherPool = questionBank.filter(question => !prioritySet.has(question.id));
            const selectedPriority = shuffleArray(priorityPool).slice(0, priorityCount);
            const selectedOthers = shuffleArray(otherPool).slice(0, subsetCount - selectedPriority.length);
            questions = shuffleArray(selectedPriority.concat(selectedOthers));
        } else {
            questions = questions.slice(0, subsetCount);
        }
    }

    activeQuizData = questions;
    userAnswers = new Array(activeQuizData.length).fill(null);
    answeredCount = 0;
    correctCount = 0;
}

function setSyncStatus(message, state = '') {
    if (!ui.syncStatus) return;
    ui.syncStatus.textContent = message;
    ui.syncStatus.classList.toggle('is-error', state === 'error');
}

function loadPendingAttempts() {
    try {
        const stored = JSON.parse(window.localStorage.getItem(ATTEMPT_QUEUE_KEY) || '[]');
        return Array.isArray(stored) ? stored.filter(attempt => attempt?.mode === 'mock_exam') : memoryAttemptQueue;
    } catch {
        return memoryAttemptQueue;
    }
}

function storePendingAttempts(attempts) {
    memoryAttemptQueue = attempts.slice(-100);
    try {
        window.localStorage.setItem(ATTEMPT_QUEUE_KEY, JSON.stringify(memoryAttemptQueue));
    } catch {
        setSyncStatus('Trình duyệt không cho phép lưu tạm lịch sử lượt làm.', 'error');
    }
}

function getLearnerId() {
    try {
        let learnerId = window.localStorage.getItem(LEARNER_ID_KEY);
        if (!learnerId) {
            const token = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            learnerId = `nlkt-${token}`;
            window.localStorage.setItem(LEARNER_ID_KEY, learnerId);
        }
        return learnerId;
    } catch {
        return `nlkt-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`}`;
    }
}

function getAttemptHistory(learnerId = getLearnerId(), attemptIds = []) {
    return new Promise((resolve, reject) => {
        if (!GOOGLE_SHEETS_WEB_APP_URL) return reject(new Error('Chưa cấu hình URL Apps Script.'));
        const callbackName = `__nlktHistory${++historyRequestSequence}`;
        const script = document.createElement('script');
        const timeout = window.setTimeout(() => finish(new Error('Hết thời gian chờ lịch sử.')), 8000);
        const finish = error => {
            window.clearTimeout(timeout);
            delete window[callbackName];
            script.remove();
            if (error) reject(error);
        };
        window[callbackName] = data => {
            finish();
            if (data?.ok && Array.isArray(data.attempts)) resolve(data);
            else reject(new Error(data?.error || 'Apps Script trả dữ liệu lịch sử không hợp lệ.'));
        };
        script.onerror = () => finish(new Error('Không thể tải lịch sử từ Apps Script.'));
        const params = { action: 'history', learner_id: learnerId, callback: callbackName };
        if (attemptIds.length) params.attempt_ids = attemptIds.join(',');
        const query = new URLSearchParams(params);
        script.src = `${GOOGLE_SHEETS_WEB_APP_URL}?${query.toString()}`;
        script.async = true;
        document.head.appendChild(script);
    });
}

async function confirmAttemptsSaved(attempts) {
    const expectedIds = new Set(attempts.map(attempt => attempt.sessionId));
    let confirmedIds = [];
    for (let attempt = 0; attempt < 8; attempt++) {
        if (attempt) await new Promise(resolve => window.setTimeout(resolve, 700));
        const historyData = await getAttemptHistory(getLearnerId(), [...expectedIds]);
        const history = historyData.attempts;
        confirmedIds = history.filter(item => expectedIds.has(item.attempt_id)).map(item => item.attempt_id);
        if (confirmedIds.length === expectedIds.size) break;
    }
    return confirmedIds;
}
const CHAPTER_NAMES = {
    1: 'Tổng quan về kế toán',
    2: 'Phương pháp tổng hợp – cân đối kế toán',
    3: 'Tài khoản và ghi sổ kép',
    4: 'Tính giá các đối tượng kế toán',
    5: 'Kế toán quá trình kinh doanh cơ bản',
    6: 'Chứng từ kế toán và kiểm kê',
    7: 'Sổ kế toán và hình thức kế toán'
};
const questionById = new Map(questionBank.map(question => [Number(question.id), question]));

function showAttemptHistory() {
    if (!ui.historyModal || !ui.historyContent) return;
    historyVisibleCount = 5;
    ui.historyContent.replaceChildren();
    const loading = document.createElement('p');
    loading.className = 'history-message history-loading';
    loading.append('Đang tải lịch sử thi thử');
    const dots = document.createElement('span');
    dots.className = 'loading-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 3; index++) {
        const dot = document.createElement('span');
        dot.textContent = '.';
        dots.appendChild(dot);
    }
    loading.appendChild(dots);
    ui.historyContent.appendChild(loading);
    ui.historyModal.classList.remove('hidden');

    getAttemptHistory().then(historyData => {
        const pending = loadPendingAttempts().filter(attempt => attempt.learnerId === getLearnerId());
        historySavedAttempts = historyData.attempts || [];
        historyPendingAttempts = pending;
        historyStatusMessage = '';
        renderAttemptHistory();
    }).catch(() => {
        const pending = loadPendingAttempts().filter(attempt => attempt.learnerId === getLearnerId());
        if (pending.length) {
            historySavedAttempts = [];
            historyPendingAttempts = pending;
            historyStatusMessage = 'Không kết nối được Google Sheets. Đang hiển thị các lượt còn lưu trên thiết bị.';
            renderAttemptHistory();
            return;
        }
        ui.historyContent.replaceChildren();
        const message = document.createElement('p');
        message.className = 'history-message history-message--error';
        message.textContent = 'Chưa tải được lịch sử. Hãy kiểm tra kết nối mạng hoặc cấu hình Apps Script rồi thử lại.';
        ui.historyContent.appendChild(message);
    });
}

function closeAttemptHistory() {
    ui.historyModal?.classList.add('hidden');
}

ui.historyModal?.addEventListener('click', event => {
    if (event.target === ui.historyModal) closeAttemptHistory();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAttemptHistory();
});

function showMoreAttemptHistory() {
    historyVisibleCount += 5;
    renderAttemptHistory();
}

function renderAttemptHistory() {
    if (!ui.historyContent) return;
    const attemptsById = new Map();
    const savedIds = new Set(historySavedAttempts.map(attempt => attempt.attempt_id || attempt.sessionId));
    const pendingIds = new Set(historyPendingAttempts.map(attempt => attempt.sessionId || attempt.attempt_id));
    [...historySavedAttempts, ...historyPendingAttempts].forEach(attempt => {
        const id = attempt.attempt_id || attempt.sessionId;
        if (id && !attemptsById.has(id)) attemptsById.set(id, attempt);
    });
    const attempts = [...attemptsById.values()].sort((first, second) => {
        const firstDate = new Date(first.submitted_at || first.finishedAt || 0).getTime();
        const secondDate = new Date(second.submitted_at || second.finishedAt || 0).getTime();
        return secondDate - firstDate;
    });

    ui.historyContent.replaceChildren();
    if (historyStatusMessage) {
        const status = document.createElement('p');
        status.className = 'history-message';
        status.textContent = historyStatusMessage;
        ui.historyContent.appendChild(status);
    }
    if (!attempts.length) {
        const empty = document.createElement('div');
        empty.className = 'history-empty';
        const title = document.createElement('strong');
        title.textContent = 'Bạn chưa có lịch sử thi thử';
        const detail = document.createElement('p');
        detail.textContent = 'Sau khi hoàn thành và nộp bài thi thử, điểm số theo từng chương sẽ được lưu tại đây.';
        empty.append(title, detail);
        ui.historyContent.appendChild(empty);
        return;
    }

    const summary = document.createElement('p');
    summary.className = 'history-summary';
    summary.textContent = `Đã ghi nhận ${attempts.length} lượt thi thử.`;
    ui.historyContent.appendChild(summary);

    attempts.slice(0, historyVisibleCount).forEach((attempt, index) => {
        const card = document.createElement('article');
        card.className = 'history-attempt';
        const header = document.createElement('div');
        header.className = 'history-attempt-header';
        const heading = document.createElement('h3');
        heading.textContent = `Lượt thi ${attempt.attempt_number || attempts.length - index}`;
        const score = Number(attempt.correct_count ?? attempt.correctCount) || 0;
        const total = Number(attempt.total_questions ?? attempt.totalQuestions) || 0;
        const percent = Number(attempt.accuracy_percent ?? attempt.accuracy)
            || (total ? score / total * 100 : 0);
        const scoreBadge = document.createElement('span');
        scoreBadge.className = 'history-score';
        scoreBadge.textContent = `${score}/${total} câu · ${percent.toFixed(1)}%`;
        header.append(heading, scoreBadge);
        card.appendChild(header);

        const metaLine = document.createElement('p');
        metaLine.className = 'history-details';
        const submittedAt = new Date(attempt.submitted_at || attempt.finishedAt || '');
        const dateLabel = Number.isNaN(submittedAt.getTime())
            ? 'Thời gian chưa xác định'
            : submittedAt.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
        const duration = Number(attempt.duration_seconds ?? attempt.durationSeconds) || 0;
        metaLine.textContent = `${dateLabel} · Thời gian làm: ${Math.floor(duration / 60)} phút ${duration % 60} giây`;
        card.appendChild(metaLine);

        const chapterDetails = document.createElement('details');
        chapterDetails.className = 'history-chapter-details';
        const chapterSummary = document.createElement('summary');
        chapterSummary.textContent = 'Chi tiết';
        chapterDetails.appendChild(chapterSummary);
        const chapters = summarizeAttemptChapters(attempt);
        const chapterGrid = document.createElement('div');
        chapterGrid.className = 'history-chapter-grid';
        Object.keys(CHAPTER_NAMES).forEach(chapterId => {
            const result = chapters[chapterId];
            if (!result) return;
            const chapterScore = document.createElement('div');
            chapterScore.className = 'history-chapter-score';
            const chapterName = document.createElement('span');
            chapterName.textContent = `Chương ${chapterId}`;
            const chapterTotal = Number(result.total) || 0;
            const chapterCorrect = Number(result.correct) || 0;
            const chapterPercent = chapterTotal ? chapterCorrect / chapterTotal * 100 : 0;
            const chapterValue = document.createElement('strong');
            chapterValue.textContent = `${chapterCorrect}/${chapterTotal} · ${chapterPercent.toFixed(0)}%`;
            chapterScore.append(chapterName, chapterValue);
            chapterGrid.appendChild(chapterScore);
        });
        chapterDetails.appendChild(chapterGrid);
        card.appendChild(chapterDetails);

        const attemptId = attempt.sessionId || attempt.attempt_id;
        if (!savedIds.has(attemptId) && pendingIds.has(attemptId)) {
            const pending = document.createElement('span');
            pending.className = 'history-pending';
            pending.textContent = 'Đang chờ đồng bộ';
            chapterDetails.appendChild(pending);
        }
        ui.historyContent.appendChild(card);
    });

    if (attempts.length > historyVisibleCount) {
        const remaining = attempts.length - historyVisibleCount;
        const moreButton = document.createElement('button');
        moreButton.className = 'history-more-button';
        moreButton.type = 'button';
        moreButton.textContent = `Xem thêm 5 lượt thi${remaining < 5 ? ` (còn ${remaining} lượt)` : ''}`;
        moreButton.addEventListener('click', showMoreAttemptHistory);
        ui.historyContent.appendChild(moreButton);
    }
}

function summarizeAttemptChapters(attempt) {
    if (attempt?.chapter_scores) {
        return attempt.chapter_scores;
    }

    const summary = {};
    (attempt?.answers || []).forEach(answer => {
        const id = Number(answer.questionId);
        const chapterId = Number(answer.chapterId) || questionById.get(id)?.chapter?.id;
        if (!chapterId) return;
        if (!summary[chapterId]) summary[chapterId] = { total: 0, correct: 0, wrong_question_ids: [] };
        summary[chapterId].total++;
        if (Number(answer.selectedIndex) >= 0 && Number(answer.selectedIndex) === Number(answer.correctIndex)) {
            summary[chapterId].correct++;
        } else {
            summary[chapterId].wrong_question_ids.push(id);
        }
    });
    return summary;
}

function addAnalysisSection(container, title) {
    const section = document.createElement('section');
    section.className = 'result-analysis-section';
    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);
    container.appendChild(section);
    return section;
}

function renderAttemptAnalysis(history, currentAttemptId, localAttempt = null, historyPending = false, questionStats = []) {
    if (!ui.resultAnalysis) return;
    ui.resultAnalysis.replaceChildren();

    const sortedHistory = [...history].sort((first, second) =>
        Number(first.attempt_number) - Number(second.attempt_number)
    );
    const current = sortedHistory.find(item => item.attempt_id === currentAttemptId) || localAttempt;
    if (!current) return;

    const currentId = current.attempt_id || current.sessionId;
    const currentIndex = sortedHistory.findIndex(item => item.attempt_id === currentId);
    const previous = currentIndex > 0
        ? sortedHistory[currentIndex - 1]
        : currentIndex === 0 ? null : sortedHistory[sortedHistory.length - 1] || null;
    const currentScore = Number(current.correct_count ?? current.correctCount) || 0;
    const currentTotal = Number(current.total_questions ?? current.totalQuestions) || 0;
    const currentPercent = Number(current.accuracy_percent ?? current.accuracy)
        || (currentTotal ? currentScore / currentTotal * 100 : 0);

    const comparison = addAnalysisSection(ui.resultAnalysis, 'So sánh lượt thi');
    const comparisonText = document.createElement('p');
    if (previous) {
        const previousScore = Number(previous.correct_count) || 0;
        const previousTotal = Number(previous.total_questions) || 0;
        const previousPercent = Number(previous.accuracy_percent)
            || (previousTotal ? previousScore / previousTotal * 100 : 0);
        const change = currentScore - previousScore;
        const direction = change > 0 ? 'tăng' : change < 0 ? 'giảm' : 'không đổi';
        comparisonText.textContent = `Lượt ${current.attempt_number || sortedHistory.length + 1}: ${currentScore}/${currentTotal} câu (${currentPercent.toFixed(1)}%). So với lượt ${previous.attempt_number}: ${direction} ${Math.abs(change)} câu đúng.`;
        comparisonText.classList.add(change > 0 ? 'is-improved' : change < 0 ? 'is-declined' : 'is-stable');
    } else if (historyPending) {
        comparisonText.textContent = 'Đang lưu lượt thi; phần so sánh lịch sử sẽ cập nhật sau khi đồng bộ.';
    } else {
        comparisonText.textContent = `Lượt đầu tiên: ${currentScore}/${currentTotal} câu đúng (${currentPercent.toFixed(1)}%). Các lượt sau sẽ được so sánh với kết quả này.`;
    }
    comparison.appendChild(comparisonText);

    const chapterSection = addAnalysisSection(ui.resultAnalysis, 'Kết quả theo chương');
    const chapterList = document.createElement('ul');
    chapterList.className = 'result-analysis-list';
    const currentChapters = summarizeAttemptChapters(current);
    const previousChapters = previous ? summarizeAttemptChapters(previous) : {};

    Object.keys(CHAPTER_NAMES).forEach(chapterKey => {
        const result = currentChapters[chapterKey];
        if (!result) return;
        const total = Number(result.total) || 0;
        const correct = Number(result.correct) || 0;
        const percent = total ? correct / total * 100 : 0;
        const prior = previousChapters[chapterKey];
        const priorTotal = Number(prior?.total) || 0;
        const priorPercent = priorTotal ? (Number(prior.correct) || 0) / priorTotal * 100 : null;
        const changeLabel = priorPercent === null
            ? ''
            : ` · ${percent - priorPercent > 0 ? '+' : ''}${(percent - priorPercent).toFixed(1)} điểm % so với lượt trước`;
        const item = document.createElement('li');
        item.textContent = `Chương ${chapterKey} · ${CHAPTER_NAMES[chapterKey]}: ${correct}/${total} câu (${percent.toFixed(1)}%)${changeLabel}`;
        chapterList.appendChild(item);
    });
    chapterSection.appendChild(chapterList);

    const wrongCounts = new Map();
    sortedHistory.forEach(attempt => {
        (attempt.wrong_question_ids || []).forEach(id => {
            const questionId = Number(id);
            wrongCounts.set(questionId, (wrongCounts.get(questionId) || 0) + 1);
        });
    });
    const isCurrentSaved = sortedHistory.some(item => item.attempt_id === currentId);
    if (!isCurrentSaved) {
        const localWrongIds = current.wrong_question_ids || (current.answers || [])
            .filter(answer => Number(answer.selectedIndex) !== Number(answer.correctIndex))
            .map(answer => answer.questionId);
        localWrongIds.forEach(id => {
            const questionId = Number(id);
            wrongCounts.set(questionId, (wrongCounts.get(questionId) || 0) + 1);
        });
    }

    if (questionStats.length) {
        wrongCounts.clear();
        questionStats.forEach(item => {
            const questionId = Number(item.question_id);
            const count = Number(item.wrong_count) || 0;
            if (questionId && count > 0) wrongCounts.set(questionId, count);
        });
    }

    const chapterTotals = new Map();
    const historyForAnalysis = [...sortedHistory];
    if (!isCurrentSaved) historyForAnalysis.push(current);
    historyForAnalysis.forEach(attempt => {
        const chapterSummary = summarizeAttemptChapters(attempt);
        Object.entries(chapterSummary).forEach(([chapterId, result]) => {
            const aggregate = chapterTotals.get(chapterId) || { total: 0, correct: 0 };
            aggregate.total += Number(result.total) || 0;
            aggregate.correct += Number(result.correct) || 0;
            chapterTotals.set(chapterId, aggregate);
        });
    });
    const recommendation = addAnalysisSection(ui.resultAnalysis, 'Gợi ý ôn tập');
    const weakChapters = [...chapterTotals.entries()]
        .map(([chapterId, result]) => ({
            chapterId,
            ...result,
            accuracy: result.total ? result.correct / result.total * 100 : 100
        }))
        .filter(result => result.correct < result.total)
        .sort((first, second) => first.accuracy - second.accuracy)
        .slice(0, 2);

    if (weakChapters.length) {
        const priority = document.createElement('p');
        priority.textContent = `Phần cần ưu tiên: ${weakChapters
            .map(item => `Chương ${item.chapterId} (${item.total - item.correct}/${item.total} câu sai, ${item.accuracy.toFixed(1)}% đúng)`)
            .join('; ')}.`;
        recommendation.appendChild(priority);
    }

    const recommendations = [...wrongCounts.entries()]
        .sort((first, second) => second[1] - first[1] || first[0] - second[0])
        .slice(0, 5);
    if (!recommendations.length) {
        const message = document.createElement('p');
        message.textContent = 'Bạn chưa có câu sai hoặc bỏ trống trong lịch sử thi thử.';
        recommendation.appendChild(message);
        return;
    }

    const recommendationList = document.createElement('ul');
    recommendationList.className = 'result-analysis-list';
    recommendations.forEach(([questionId, wrongCount]) => {
        const item = document.createElement('li');
        const question = questionById.get(questionId);
        const title = question?.question || 'Không tìm thấy nội dung câu hỏi.';
        item.textContent = `Câu ID ${questionId} · sai/bỏ trống ${wrongCount} lượt: ${title.slice(0, 150)}${title.length > 150 ? '…' : ''}`;
        recommendationList.appendChild(item);
    });
    recommendation.appendChild(recommendationList);
}
function startSession(mode) {
    sessionId = window.crypto?.randomUUID?.()
        || `nlkt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStartedAt = Date.now();
    sessionMode = mode;
}

function finishSession(isSubmitted = false) {
    if (!sessionId || !isSubmitted || sessionMode !== 'mock_exam') {
        sessionId = null;
        return;
    }

    const finishedAt = Date.now();
    const attempt = {
        sessionId,
        learnerId: getLearnerId(),
        mode: sessionMode,
        startedAt: new Date(sessionStartedAt).toISOString(),
        finishedAt: new Date(finishedAt).toISOString(),
        durationSeconds: Math.max(0, Math.round((finishedAt - sessionStartedAt) / 1000)),
        totalQuestions: activeQuizData.length,
        answeredCount,
        correctCount,
        accuracy: activeQuizData.length ? Number(((correctCount / activeQuizData.length) * 100).toFixed(1)) : 0,
        answers: activeQuizData.map((question, index) => ({
            questionId: question.id,
            chapterId: question.chapter?.id || 0,
            selectedIndex: userAnswers[index] ?? -1,
            correctIndex: question.correct
        }))
    };

    sessionId = null;
    lastSubmittedAttempt = attempt;
    const pending = loadPendingAttempts();
    pending.push(attempt);
    storePendingAttempts(pending);

    if (!GOOGLE_SHEETS_WEB_APP_URL) {
        setSyncStatus('Chưa cấu hình Google Sheets. Lượt làm đang được lưu tạm trên trình duyệt.');
        return;
    }

    setSyncStatus('Đang lưu kết quả thi thử lên Google Sheets…');
    syncPendingAttempts();
}

function scheduleAttemptSync() {
    if (!GOOGLE_SHEETS_WEB_APP_URL || idleSyncHandle !== null) return;

    const flush = () => {
        idleSyncHandle = null;
        syncPendingAttempts();
    };

    if ('requestIdleCallback' in window) {
        idleSyncHandle = window.requestIdleCallback(flush, { timeout: 2500 });
    } else {
        idleSyncHandle = window.setTimeout(flush, 500);
    }
}

function syncPendingAttempts() {
    if (!GOOGLE_SHEETS_WEB_APP_URL || isSyncingAttempts || !navigator.onLine) return;
    const pending = loadPendingAttempts().slice(0, 10);
    if (pending.length === 0) return;

    isSyncingAttempts = true;
    const body = new URLSearchParams({ payload: JSON.stringify({ attempts: pending }) });
    window.fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body,
        keepalive: true
    }).then(() => confirmAttemptsSaved(pending))
        .then(async savedIds => {
            const confirmed = new Set(savedIds);
            const remaining = loadPendingAttempts().filter(attempt => !confirmed.has(attempt.sessionId));
            storePendingAttempts(remaining);
            if (savedIds.length) setSyncStatus(`Đã xác nhận lưu ${savedIds.length} lượt thi thử trên Google Sheets.`);
            if (remaining.length) setSyncStatus('Apps Script chưa xác nhận đủ lượt thi. Dữ liệu vẫn được giữ trên thiết bị.', 'error');

            if (lastSubmittedAttempt && confirmed.has(lastSubmittedAttempt.sessionId)) {
                try {
                    const historyData = await getAttemptHistory();
                    renderAttemptAnalysis(
                        historyData.attempts,
                        lastSubmittedAttempt.sessionId,
                        lastSubmittedAttempt,
                        false,
                        historyData.question_stats || []
                    );
                } catch {
                    // Giữ phân tích tại chỗ nếu lượt đã lưu nhưng chưa tải được lịch sử.
                }
            }
        })
        .catch(() => {
            setSyncStatus('Chưa xác nhận được dữ liệu từ Google Sheets. Lượt thi vẫn được giữ trên thiết bị.', 'error');
        })
        .finally(() => {
            isSyncingAttempts = false;
        });
}

function flushAttemptsOnPageHide() {
    finishSession();
    if (idleSyncHandle !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleSyncHandle);
        else window.clearTimeout(idleSyncHandle);
        idleSyncHandle = null;
    }

    if (!GOOGLE_SHEETS_WEB_APP_URL || !navigator.sendBeacon) return;
    const pending = loadPendingAttempts().slice(0, 10);
    if (pending.length === 0) return;
    const body = new URLSearchParams({ payload: JSON.stringify({ attempts: pending }) });
    navigator.sendBeacon(GOOGLE_SHEETS_WEB_APP_URL, body);
}

window.addEventListener('pagehide', flushAttemptsOnPageHide);
window.addEventListener('online', scheduleAttemptSync);

function startStandardMode(isRandom = false) {
    finishSession();
    stopTimer();
    isExamMode = false;
    isReviewingExam = false;
    prepareQuizData(isRandom);
    startSession(isRandom ? 'review_random' : 'review_order');
    setupUIMode();
}

// Practice exam: 60 random questions, including 5 from the priority ID group.
function startExamMode() {
    finishSession();
    stopTimer();
    isReviewingExam = false;
    lastSubmittedAttempt = null;
    isExamMode = true;
    timeLeft = 60 * 60;
    prepareQuizData(true, 60, QUESTION_PRIORITY_IDS, 5);
    startSession('mock_exam');
    setupUIMode();
    startTimer();
}

function setupUIMode() {
    ui.timerBox?.classList.toggle('hidden', !isExamMode);
    ui.submitButtons.forEach(button => button?.classList.toggle('hidden', !isExamMode));
    ui.questionTools?.classList.toggle('hidden', isExamMode);

    populateQuestionSelect();
    renderQuestion();
    updateMeta();
}

function populateQuestionSelect() {
    if (!ui.questionSelect) return;

    const options = document.createDocumentFragment();
    activeQuizData.forEach((question, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `Câu ${index + 1}`;
        options.appendChild(option);
    });

    ui.questionSelect.replaceChildren(options);
    ui.questionSelect.value = activeQuizData.length > 0 ? '0' : '';
}

function jumpToQuestion(value) {
    const questionIndex = Number.parseInt(value, 10);
    if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= activeQuizData.length) return;

    const generation = renderGeneration;
    const scrollWhenReady = () => {
        if (generation !== renderGeneration) return;

        const question = document.getElementById(`question-${questionIndex + 1}`);
        if (question) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            question.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            return;
        }

        window.requestAnimationFrame(scrollWhenReady);
    };

    scrollWhenReady();
}

function scrollToTop() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

function stopTimer() {
    if (timerTimeout !== null) {
        window.clearTimeout(timerTimeout);
        timerTimeout = null;
    }
}

function startTimer() {
    stopTimer();
    timerDeadline = Date.now() + timeLeft * 1000;

    const updateTimer = () => {
        if (!isExamMode) return;

        timeLeft = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (ui.timeRemaining) {
            ui.timeRemaining.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        if (timeLeft === 0) {
            stopTimer();
            submitQuiz();
            return;
        }

        timerTimeout = window.setTimeout(updateTimer, 1000);
    };

    updateTimer();
}

function createQuestionCard(questionIndex) {
    const question = activeQuizData[questionIndex];
    const selectedOption = userAnswers[questionIndex];
    const hasAnswered = selectedOption !== null;
    const shouldRevealAnswer = !isExamMode && (hasAnswered || isReviewingExam);
    const card = document.createElement('section');
    card.className = 'quiz-question';
    card.id = `question-${questionIndex + 1}`;
    card.dataset.questionIndex = String(questionIndex);

    const heading = document.createElement('div');
    heading.className = 'quiz-question-heading';

    const number = document.createElement('span');
    number.className = 'quiz-question-number';
    number.textContent = `Câu hỏi ${questionIndex + 1}`;
    heading.appendChild(number);

    if (shouldRevealAnswer) {
        const status = document.createElement('span');
        const isCorrect = selectedOption === question.correct;
        status.className = `quiz-answer-status ${!hasAnswered ? 'is-unanswered' : isCorrect ? 'is-correct' : 'is-wrong'}`;
        status.textContent = !hasAnswered ? 'Chưa trả lời' : isCorrect ? 'Đúng' : 'Sai';
        heading.appendChild(status);
    }
    card.appendChild(heading);

    const title = document.createElement('h2');
    title.textContent = question.question;
    card.appendChild(title);

    const options = document.createElement('div');
    options.className = 'quiz-options';

    question.options.forEach((optionText, optionIndex) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'quiz-option';
        option.dataset.optionIndex = String(optionIndex);
        option.setAttribute('aria-pressed', String(selectedOption === optionIndex));

        if (shouldRevealAnswer) {
            if (optionIndex === question.correct) option.classList.add('is-correct');
            else if (selectedOption === optionIndex) option.classList.add('is-wrong');
            option.disabled = true;
        } else if (selectedOption === optionIndex) {
            option.classList.add('is-selected');
        }

        const letter = document.createElement('span');
        letter.className = 'quiz-option-letter';
        letter.textContent = OPTION_LETTERS[optionIndex] || String(optionIndex + 1);

        const text = document.createElement('span');
        text.className = 'quiz-option-text';
        text.textContent = optionText;

        option.append(letter, text);
        options.appendChild(option);
    });
    card.appendChild(options);

    if (shouldRevealAnswer) {
        const isCorrect = selectedOption === question.correct;
        const explanation = document.createElement('div');
        explanation.className = `quiz-explanation ${!hasAnswered ? 'is-unanswered' : isCorrect ? 'is-correct' : 'is-wrong'}`;

        const answer = document.createElement('strong');
        const correctAnswer = `Đáp án đúng: ${OPTION_LETTERS[question.correct]?.toUpperCase() || ''}. ${question.options[question.correct]}`;
        answer.textContent = hasAnswered && isCorrect ? `Chính xác! ${correctAnswer}` : correctAnswer;

        const detail = document.createElement('p');
        detail.textContent = question.explanation;
        explanation.append(answer, detail);
        card.appendChild(explanation);
    }

    return card;
}

// Render a small time-bounded batch each frame so scrolling and input stay responsive.
function renderQuestion() {
    const container = ui.questionContainer;
    if (!container) return;

    if (pendingRenderFrame) {
        window.cancelAnimationFrame(pendingRenderFrame);
        pendingRenderFrame = 0;
    }

    const generation = ++renderGeneration;
    const questions = activeQuizData;
    container.replaceChildren();

    if (questions.length === 0) {
        const message = document.createElement('p');
        message.className = 'loading-message';
        message.textContent = 'Không tải được câu hỏi. Hãy kiểm tra file questions.js.';
        container.appendChild(message);
        return;
    }

    let nextQuestionIndex = 0;
    const renderNextChunk = () => {
        pendingRenderFrame = 0;
        if (generation !== renderGeneration || questions !== activeQuizData) return;

        const fragment = document.createDocumentFragment();
        const sliceStartedAt = performance.now();

        do {
            fragment.appendChild(createQuestionCard(nextQuestionIndex));
            nextQuestionIndex++;
        } while (
            nextQuestionIndex < questions.length &&
            performance.now() - sliceStartedAt < RENDER_SLICE_MS
        );

        container.appendChild(fragment);

        if (nextQuestionIndex < questions.length) {
            pendingRenderFrame = window.requestAnimationFrame(renderNextChunk);
        }
    };

    pendingRenderFrame = window.requestAnimationFrame(renderNextChunk);
}

function selectAnswer(questionIndex, optionIndex) {
    const question = activeQuizData[questionIndex];
    if (!question || optionIndex < 0 || optionIndex >= question.options.length) return;

    const previousAnswer = userAnswers[questionIndex];
    if (previousAnswer === optionIndex) return;

    if (previousAnswer === null) answeredCount++;
    if (previousAnswer === question.correct) correctCount--;
    if (optionIndex === question.correct) correctCount++;
    userAnswers[questionIndex] = optionIndex;

    updateMeta();

    const currentCard = document.getElementById(`question-${questionIndex + 1}`);
    if (currentCard) currentCard.replaceWith(createQuestionCard(questionIndex));
}

function updateMeta() {
    if (ui.metaTotal) ui.metaTotal.textContent = `Tổng số câu: ${activeQuizData.length}`;
    if (ui.metaAnswered) ui.metaAnswered.textContent = `Đã trả lời: ${answeredCount}/${activeQuizData.length}`;
    if (ui.metaScore) ui.metaScore.textContent = `Số câu đúng: ${correctCount}`;
}

function submitQuiz() {
    stopTimer();
    finishSession(true);
    if (!ui.resultsModal || !ui.resultText) return;

    const percentage = activeQuizData.length > 0
        ? ((correctCount / activeQuizData.length) * 100).toFixed(1)
        : '0.0';

    ui.resultText.innerHTML = `Đã trả lời: <strong class="text-slate-900">${answeredCount} / ${activeQuizData.length}</strong> câu.<br>Số câu đúng: <strong class="text-emerald-600">${correctCount} câu</strong><br>Tỷ lệ chính xác: <strong class="text-blue-600">${percentage}%</strong>`;
    renderAttemptAnalysis([], lastSubmittedAttempt?.sessionId, lastSubmittedAttempt, true);
    ui.resultsModal.classList.remove('hidden');
}

function closeResults() {
    ui.resultsModal?.classList.add('hidden');

    if (!isExamMode) return;

    isExamMode = false;
    isReviewingExam = true;
    ui.timerBox?.classList.add('hidden');
    ui.submitButtons.forEach(button => button?.classList.add('hidden'));
    ui.questionTools?.classList.remove('hidden');
    populateQuestionSelect();
    renderQuestion();
}

function startNewExam() {
    ui.resultsModal?.classList.add('hidden');
    startExamMode();
}

function resetQuiz() {
    finishSession();
    stopTimer();
    isExamMode = false;
    isReviewingExam = false;
    timeLeft = 60 * 60;
    prepareQuizData(false);
    startSession('review_order');
    setupUIMode();
}

// Start with the complete question bank in its original order.
startStandardMode(false);
scheduleAttemptSync();

















