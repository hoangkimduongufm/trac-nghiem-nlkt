// File: script.js

const QUESTION_PRIORITY_IDS = [125, 105, 104, 103, 102, 101, 100, 96, 95, 93, 92];
const RENDER_SLICE_MS = 8;
const OPTION_LETTERS = ['a', 'b', 'c', 'd'];

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
    resultText: document.getElementById('result-text')
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

function startStandardMode(isRandom = false) {
    stopTimer();
    isExamMode = false;
    isReviewingExam = false;
    prepareQuizData(isRandom);
    setupUIMode();
}

// Practice exam: 60 random questions, including 5 from the priority ID group.
function startExamMode() {
    stopTimer();
    isReviewingExam = false;
    isExamMode = true;
    timeLeft = 60 * 60;
    prepareQuizData(true, 60, QUESTION_PRIORITY_IDS, 5);
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
    if (!ui.resultsModal || !ui.resultText) return;

    const percentage = activeQuizData.length > 0
        ? ((correctCount / activeQuizData.length) * 100).toFixed(1)
        : '0.0';

    ui.resultText.innerHTML = `Đã trả lời: <strong class="text-slate-900">${answeredCount} / ${activeQuizData.length}</strong> câu.<br>Số câu đúng: <strong class="text-emerald-600">${correctCount} câu</strong><br>Tỷ lệ chính xác: <strong class="text-blue-600">${percentage}%</strong>`;
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
    stopTimer();
    isExamMode = false;
    isReviewingExam = false;
    timeLeft = 60 * 60;
    prepareQuizData(false);
    setupUIMode();
}

// Start with the complete question bank in its original order.
startStandardMode(false);
