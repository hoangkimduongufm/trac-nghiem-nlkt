const SPREADSHEET_ID = '1P2yiwlF4J7eX3R6OK_SLu2-uU4C9nKWrGQMaso-vivA';
const ATTEMPTS_SHEET_NAME = 'ExamAttempts';
const QUESTION_STATS_SHEET_NAME = 'QuestionStats';
const MAX_ATTEMPTS_PER_REQUEST = 10;
const MAX_QUESTIONS_PER_ATTEMPT = 185;

function doGet(event) {
  const params = event && event.parameter ? event.parameter : {};
  if (params.action === 'history') return getHistoryResponse_(params);
  return jsonResponse_({ ok: true, service: 'NLKT exam history API' });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payloadText = event && event.parameter && event.parameter.payload
      ? event.parameter.payload
      : event && event.postData && event.postData.contents;
    if (!payloadText || payloadText.length > 100000) throw new Error('Request rỗng hoặc vượt quá kích thước cho phép.');

    let request;
    try {
      request = JSON.parse(payloadText);
    } catch (error) {
      const match = payloadText.match(/(?:^|&)payload=([^&]*)/);
      if (!match) throw error;
      request = JSON.parse(decodeURIComponent(match[1].replace(/\+/g, ' ')));
    }

    const attempts = Array.isArray(request.attempts) ? request.attempts : [];
    if (!attempts.length || attempts.length > MAX_ATTEMPTS_PER_REQUEST) throw new Error('Số lượt thi gửi lên không hợp lệ.');

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const attemptsSheet = getSheet_(spreadsheet, ATTEMPTS_SHEET_NAME, [
      'attempt_id', 'learner_id', 'attempt_number', 'submitted_at', 'score',
      'total_questions', 'correct_count', 'duration_seconds', 'chapter_scores_json',
      'wrong_question_ids', 'answered_count', 'accuracy_percent', 'answers_json'
    ]);
    const statsSheet = getSheet_(spreadsheet, QUESTION_STATS_SHEET_NAME, [
      'learner_id', 'question_id', 'wrong_count', 'attempt_count', 'last_wrong_at'
    ]);

    const results = attempts.map(attempt => saveAttempt_(attemptsSheet, statsSheet, attempt));
    return jsonResponse_({ ok: true, saved: results.length, attempts: results });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function getSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveAttempt_(sheet, statsSheet, attempt) {
  if (!attempt || !/^[\w-]{1,80}$/.test(String(attempt.sessionId || ''))) throw new Error('Mã lượt thi không hợp lệ.');
  if (!/^nlkt-[\w-]{16,80}$/.test(String(attempt.learnerId || ''))) throw new Error('Mã người thi không hợp lệ.');
  if (attempt.mode !== 'mock_exam') throw new Error('Chỉ chấp nhận lượt thi thử.');

  const answers = Array.isArray(attempt.answers) ? attempt.answers : [];
  const total = Number(attempt.totalQuestions);
  if (!Number.isInteger(total) || total < 1 || total > MAX_QUESTIONS_PER_ATTEMPT || answers.length !== total) {
    throw new Error('Số câu hỏi không hợp lệ.');
  }

  const learnerId = String(attempt.learnerId);
  const attemptId = String(attempt.sessionId);
  const existing = findRow_(sheet, 1, attemptId);
  if (existing) return { attempt_id: attemptId, duplicate: true };

  let answered = 0;
  let correct = 0;
  const chapterScores = {};
  const wrongIds = [];
  const normalizedAnswers = answers.map(answer => {
    const questionId = Number(answer.questionId);
    const selected = Number(answer.selectedIndex);
    const expected = Number(answer.correctIndex);
    if (!Number.isInteger(questionId) || questionId < 1 || questionId > MAX_QUESTIONS_PER_ATTEMPT ||
        !Number.isInteger(expected) || expected < 0 || expected > 3 ||
        !Number.isInteger(selected) || selected < -1 || selected > 3) throw new Error('Đáp án gửi lên không hợp lệ.');

    const hasAnswer = selected >= 0;
    const isCorrect = hasAnswer && selected === expected;
    const chapter = chapterForQuestion_(questionId);
    if (answer.chapterId && Number(answer.chapterId) !== chapter) {
      throw new Error('Chương câu hỏi không khớp với ID.');
    }
    if (hasAnswer) answered++;
    if (isCorrect) correct++;
    if (!isCorrect) wrongIds.push(questionId);
    if (!chapterScores[chapter]) chapterScores[chapter] = { total: 0, correct: 0, wrong_question_ids: [] };
    chapterScores[chapter].total++;
    if (isCorrect) chapterScores[chapter].correct++;
    else chapterScores[chapter].wrong_question_ids.push(questionId);
    return [questionId, selected, expected, chapter];
  });

  const attemptNumber = nextAttemptNumber_(sheet, learnerId);
  const submittedAt = new Date();
  const row = [
    attemptId, learnerId, attemptNumber, submittedAt, correct, total, correct,
    Math.max(0, Number(attempt.durationSeconds) || 0), JSON.stringify(chapterScores),
    wrongIds.join(','), answered, Number(((correct / total) * 100).toFixed(1)), JSON.stringify(normalizedAnswers)
  ];
  sheet.appendRow(row);
  updateQuestionStats_(statsSheet, learnerId, normalizedAnswers, submittedAt);
  return { attempt_id: attemptId, attempt_number: attemptNumber, score: correct, accuracy: row[11] };
}

function chapterForQuestion_(id) {
  if (id <= 30) return 1;
  if (id <= 56 || (id >= 106 && id <= 111)) return 2;
  if (id <= 86) return 3;
  if (id <= 105) return 4;
  if (id <= 131) return 5;
  if (id <= 160) return 6;
  return 7;
}

function updateQuestionStats_(sheet, learnerId, answers, submittedAt) {
  const rows = sheet.getDataRange().getValues();
  const rowMap = new Map();
  for (let index = 1; index < rows.length; index++) rowMap.set(`${rows[index][0]}:${rows[index][1]}`, index + 1);

  answers.forEach(([questionId, selected, expected]) => {
    const key = `${learnerId}:${questionId}`;
    const rowNumber = rowMap.get(key);
    const isWrong = selected !== expected;
    if (rowNumber) {
      const values = sheet.getRange(rowNumber, 3, 1, 3).getValues()[0];
      sheet.getRange(rowNumber, 3, 1, 3).setValues([[
        (Number(values[0]) || 0) + (isWrong ? 1 : 0),
        (Number(values[1]) || 0) + 1,
        isWrong ? submittedAt : values[2]
      ]]);
    } else {
      sheet.appendRow([learnerId, questionId, isWrong ? 1 : 0, 1, isWrong ? submittedAt : '']);
      rowMap.set(key, sheet.getLastRow());
    }
  });
}

function getHistoryResponse_(params) {
  const learnerId = String(params.learner_id || '');
  if (!/^nlkt-[\w-]{16,80}$/.test(learnerId)) return jsonResponse_({ ok: false, error: 'Mã người thi không hợp lệ.' });
  const requestedIds = new Set(String(params.attempt_ids || '').split(',').filter(id => /^[\w-]{1,80}$/.test(id)));

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(ATTEMPTS_SHEET_NAME);
  const attempts = [];
  if (sheet && sheet.getLastRow() > 1) {
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).getValues();
    rows.forEach(row => {
      if (String(row[1]) !== learnerId || (requestedIds.size && !requestedIds.has(String(row[0])))) return;
      attempts.push({
        attempt_id: String(row[0]), attempt_number: Number(row[2]),
        submitted_at: new Date(row[3]).toISOString(), score: Number(row[4]),
        total_questions: Number(row[5]), correct_count: Number(row[6]),
        duration_seconds: Number(row[7]), chapter_scores: parseJson_(row[8], {}),
        wrong_question_ids: String(row[9] || '').split(',').filter(Boolean).map(Number),
        answered_count: Number(row[10]), accuracy_percent: Number(row[11])
      });
    });
  }
  attempts.sort((a, b) => a.attempt_number - b.attempt_number);
  const statsSheet = spreadsheet.getSheetByName(QUESTION_STATS_SHEET_NAME);
  const data = {
    ok: true,
    attempts: requestedIds.size ? attempts : attempts.slice(-30),
    question_stats: getQuestionStatsForLearner_(statsSheet, learnerId)
  };
  const callback = String(params.callback || '');
  if (callback) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(callback)) return jsonResponse_({ ok: false, error: 'Callback không hợp lệ.' });
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonResponse_(data);
}

function getQuestionStatsForLearner_(sheet, learnerId) {
  if (!sheet || sheet.getLastRow() < 2) return [];

  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues()
    .filter(row => String(row[0]) === learnerId && Number(row[2]) > 0)
    .map(row => ({
      question_id: Number(row[1]),
      wrong_count: Number(row[2]) || 0,
      attempt_count: Number(row[3]) || 0
    }));
}
function nextAttemptNumber_(sheet, learnerId) {
  if (sheet.getLastRow() < 2) return 1;
  const ids = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  return ids.reduce((count, row) => count + (String(row[0]) === learnerId ? 1 : 0), 0) + 1;
}

function findRow_(sheet, column, value) {
  if (sheet.getLastRow() < 2) return null;
  const match = sheet.getRange(2, column, sheet.getLastRow() - 1, 1)
    .createTextFinder(value).matchEntireCell(true).findNext();
  return match ? match.getRow() : null;
}

function validDate_(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) throw new Error('Thời điểm lượt thi không hợp lệ.');
  return date;
}

function parseJson_(value, fallback) {
  try { return JSON.parse(value); } catch (error) { return fallback; }
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}








