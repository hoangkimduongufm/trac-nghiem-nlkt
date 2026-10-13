// File: script.js
let activeQuizData = [];
let currentIndex = 0;
let userAnswers = [];
let correctCount = 0;
let isExamMode = false;
let timerInterval = null;
let timeLeft = 60 * 60;
const EXAM_PRIORITY_IDS = [125, 105, 104, 103, 102, 101, 100, 96, 95, 93, 92];

// Hàm xáo trộn mảng (Fisher-Yates Shuffle) dùng cho câu hỏi
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Chuẩn bị dữ liệu: Chỉ random thứ tự câu hỏi (hoặc cắt gọn cho thi thử), giữ nguyên vị trí đáp án gốc
function prepareQuizData(isRandom = false, subsetCount = null, priorityIds = [], priorityCount = 0) {
    let rawData = [...quizData];

    if (subsetCount && subsetCount < rawData.length) {
        if (priorityIds.length && priorityCount > 0) {
            const prioritySet = new Set(priorityIds);
            const priorityPool = rawData.filter(question => prioritySet.has(question.id));
            const selectedPriority = shuffleArray(priorityPool).slice(0, priorityCount);
            const otherQuestions = rawData.filter(question => !prioritySet.has(question.id));
            const selectedOthers = shuffleArray(otherQuestions).slice(0, subsetCount - selectedPriority.length);
            rawData = shuffleArray([...selectedPriority, ...selectedOthers]);
        } else {
            rawData = shuffleArray(rawData).slice(0, subsetCount);
        }
    } else if (isRandom) {
        rawData = shuffleArray(rawData);
    }

    activeQuizData = rawData.map(question => ({
        id: question.id,
        question: question.question,
        options: [...question.options],
        correct: question.correct,
        explanation: question.explanation
    }));

    userAnswers = new Array(activeQuizData.length).fill(null);
    currentIndex = 0;
    correctCount = 0;
}
function startStandardMode(isRandom = false) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    isExamMode = false;
    prepareQuizData(isRandom, null);
    setupUIMode();
}

// Chế độ thi thử 60 phút - 60 câu ngẫu nhiên (chỉ random câu hỏi, giữ nguyên đáp án)
function startExamMode() {
    isExamMode = true;
    timeLeft = 60 * 60;
    prepareQuizData(true, 60, EXAM_PRIORITY_IDS, 5);
    setupUIMode();
    startTimer();
}

function setupUIMode() {
    document.getElementById('timer-box').classList.toggle('hidden', !isExamMode);
    document.getElementById('submit-button').classList.toggle('hidden', !isExamMode);
    document.getElementById('submit-button-bottom').classList.toggle('hidden', !isExamMode);
    document.getElementById('question-tools').classList.toggle('hidden', isExamMode);
    populateQuestionSelect();
    renderQuestion();
    updateMeta();
}

function populateQuestionSelect() {
    const select = document.getElementById('question-select');
    select.replaceChildren();
    activeQuizData.forEach((question, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `Câu ${index + 1}`;
        select.appendChild(option);
    });
    select.value = '0';
}

function jumpToQuestion(index) {
    const questionIndex = Number.parseInt(index, 10);
    const question = document.getElementById(`question-${questionIndex + 1}`);
    if (!question) return;
    question.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('10 điểm rồi nộp bài đi!');
            submitQuiz();
            return;
        }
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById('time-remaining').innerText = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function renderQuestion() {
    const container = document.getElementById('question-container');
    container.replaceChildren();
    const optionLetters = ['a', 'b', 'c', 'd'];

    activeQuizData.forEach((q, questionIndex) => {
        const selectedOpt = userAnswers[questionIndex];
        const hasAnswered = selectedOpt !== null;
        const card = document.createElement('section');
        card.className = 'quiz-question';
        card.id = `question-${questionIndex + 1}`;

        const topBar = document.createElement('div');
        topBar.className = 'quiz-question-heading';
        const number = document.createElement('span');
        number.className = 'quiz-question-number';
        number.textContent = `Câu hỏi ${questionIndex + 1}`;
        topBar.appendChild(number);

        if (!isExamMode && hasAnswered) {
            const status = document.createElement('span');
            const isCorrect = selectedOpt === q.correct;
            status.className = `quiz-answer-status ${isCorrect ? 'is-correct' : 'is-wrong'}`;
            status.textContent = isCorrect ? 'Đúng' : 'Sai';
            topBar.appendChild(status);
        }
        card.appendChild(topBar);

        const title = document.createElement('h2');
        title.textContent = q.question;
        card.appendChild(title);

        const options = document.createElement('div');
        options.className = 'quiz-options';
        q.options.forEach((optionText, optionIndex) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'quiz-option';
            option.setAttribute('aria-pressed', String(selectedOpt === optionIndex));
            if (!isExamMode && hasAnswered) {
                if (optionIndex === q.correct) option.classList.add('is-correct');
                else if (selectedOpt === optionIndex) option.classList.add('is-wrong');
                option.disabled = true;
            } else if (selectedOpt === optionIndex) {
                option.classList.add('is-selected');
            }
            const letter = document.createElement('span');
            letter.className = 'quiz-option-letter';
            letter.textContent = optionLetters[optionIndex] || String(optionIndex + 1);
            const text = document.createElement('span');
            text.className = 'quiz-option-text';
            text.textContent = optionText;
            option.append(letter, text);
            option.addEventListener('click', () => selectAnswer(questionIndex, optionIndex));
            options.appendChild(option);
        });
        card.appendChild(options);

        if (!isExamMode && hasAnswered) {
            const isCorrect = selectedOpt === q.correct;
            const explanation = document.createElement('div');
            explanation.className = `quiz-explanation ${isCorrect ? 'is-correct' : 'is-wrong'}`;
            const answer = document.createElement('strong');
            answer.textContent = isCorrect
                ? 'Chính xác! '
                : `Đáp án đúng: ${optionLetters[q.correct]?.toUpperCase() || ''}. ${q.options[q.correct]} `;
            const detail = document.createElement('p');
            detail.textContent = q.explanation;
            explanation.append(answer, detail);
            card.appendChild(explanation);
        }
        container.appendChild(card);
    });
}
function selectAnswer(questionIndex, optionIndex) {
    const card = document.getElementById(`question-${questionIndex + 1}`);
    const previousTop = card?.getBoundingClientRect().top ?? 0;
    userAnswers[questionIndex] = optionIndex;
    correctCount = userAnswers.reduce((count, answer, index) =>
        count + (answer !== null && answer === activeQuizData[index].correct ? 1 : 0), 0);
    updateMeta();
    renderQuestion();
    const updatedCard = document.getElementById(`question-${questionIndex + 1}`);
    if (updatedCard && previousTop) {
        window.scrollBy(0, updatedCard.getBoundingClientRect().top - previousTop);
    }
}
function updateMeta() {
    const answeredCount = userAnswers.filter(a => a !== null).length;
    document.getElementById('meta-total').innerText = `Tổng số câu: ${activeQuizData.length}`;
    document.getElementById('meta-answered').innerText = `Đã trả lời: ${answeredCount}/${activeQuizData.length}`;
    document.getElementById('meta-score').innerText = `Số câu đúng: ${correctCount}`;
}

function submitQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    const answeredCount = userAnswers.filter(a => a !== null).length;
    const modal = document.getElementById('results-modal');
    const resultText = document.getElementById('result-text');
    
    resultText.innerHTML = `Đã trả lời: <strong class="text-slate-900">${answeredCount} / ${activeQuizData.length}</strong> câu.<br>Số câu đúng: <strong class="text-emerald-600">${correctCount} câu</strong><br>Tỷ lệ chính xác: <strong class="text-blue-600">${((correctCount / activeQuizData.length) * 100).toFixed(1)}%</strong>`;
    modal.classList.remove('hidden');
}

function closeResults() {
    document.getElementById('results-modal').classList.add('hidden');
    
    // Khi đang ở chế độ thi thử mà bấm "Xem lại chi tiết"
    if (isExamMode) {
        isExamMode = false; // Thoát chế độ thi nghiêm ngặt
        document.getElementById('timer-box').classList.add('hidden'); // Ẩn đồng hồ
        document.getElementById('submit-button').classList.add('hidden');
        document.getElementById('submit-button-bottom').classList.add('hidden');
        document.getElementById('question-tools').classList.remove('hidden');
        renderQuestion(); // Render lại để hiển thị đáp án đã chọn, đáp án đúng và giải thích
    }
}

function resetQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    isExamMode = false;
    timeLeft = 60 * 60;
    prepareQuizData(false, null);
    setupUIMode();
}
// Tự động mở phần ôn tập theo thứ tự ID khi tải trang.
startStandardMode(false);
