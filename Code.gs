const SPREADSHEET_ID = '1P2yiwlF4J7eX3R6OK_SLu2-uU4C9nKWrGQMaso-vivA';
const ATTEMPTS_SHEET_NAME = 'ExamAttempts';
const QUESTION_STATS_SHEET_NAME = 'QuestionStats';
const MAX_ATTEMPTS_PER_REQUEST = 10;
const MAX_QUESTIONS_PER_ATTEMPT = 185;
const HISTORY_CACHE_TTL_SECONDS = 60;
const HISTORY_CACHE_PREFIX = 'nlkt-history-v1:';

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

    const batch = saveAttemptsBatch_(attemptsSheet, statsSheet, attempts);
    batch.changedLearnerIds.forEach(invalidateHistoryCache_);
    const savedCount = batch.results.filter(result => !result.duplicate).length;
    return jsonResponse_({ ok: true, saved: savedCount, attempts: batch.results });
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

function saveAttemptsBatch_(sheet, statsSheet, attempts) {
  const lastRow = sheet.getLastRow();
  const existingRows = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, 3).getValues()
    : [];
  const existingIds = new Set();
  const attemptNumbers = new Map();
  existingRows.forEach(row => {
    existingIds.add(String(row[0]));
    const learnerId = String(row[1]);
    const attemptNumber = Number(row[2]) || 0;
    attemptNumbers.set(learnerId, Math.max(attemptNumbers.get(learnerId) || 0, attemptNumber));
  });

  const results = [];
  const rowsToAppend = [];
  const statsUpdates = [];
  const changedLearnerIds = new Set();
  const seenIds = new Set();

  attempts.forEach(attempt => {
    const attemptId = String(attempt?.sessionId || '');
    if (!/^[\w-]{1,80}$/.test(attemptId)) throw new Error('Mã lượt thi không hợp lệ.');
    if (!/^nlkt-[\w-]{16,80}$/.test(String(attempt?.learnerId || ''))) throw new Error('Mã người thi không hợp lệ.');
    if (attempt.mode !== 'mock_exam') throw new Error('Chỉ chấp nhận lượt thi thử.');

    if (existingIds.has(attemptId) || seenIds.has(attemptId)) {
      results.push({ attempt_id: attemptId, duplicate: true });
      return;
    }

    const learnerId = String(attempt?.learnerId || '');
    const attemptNumber = (attemptNumbers.get(learnerId) || 0) + 1;
    const prepared = prepareAttempt_(attempt, attemptNumber);
    rowsToAppend.push(prepared.row);
    statsUpdates.push({ learnerId, answers: prepared.answers, submittedAt: prepared.submittedAt });
    attemptNumbers.set(learnerId, attemptNumber);
    existingIds.add(attemptId);
    seenIds.add(attemptId);
    changedLearnerIds.add(learnerId);
    results.push({
      attempt_id: attemptId,
      attempt_number: attemptNumber,
      score: prepared.correct,
      accuracy: prepared.row[11]
    });
  });

  if (rowsToAppend.length) {
    sheet.getRange(lastRow + 1, 1, rowsToAppend.length, 13).setValues(rowsToAppend);
    updateQuestionStatsBatch_(statsSheet, statsUpdates);
  }

  return { results, changedLearnerIds: [...changedLearnerIds] };
}

function prepareAttempt_(attempt, attemptNumber) {
  if (!attempt || !/^[\w-]{1,80}$/.test(String(attempt.sessionId || ''))) throw new Error('Mã lượt thi không hợp lệ.');
  if (!/^nlkt-[\w-]{16,80}$/.test(String(attempt.learnerId || ''))) throw new Error('Mã người thi không hợp lệ.');
  if (attempt.mode !== 'mock_exam') throw new Error('Chỉ chấp nhận lượt thi thử.');

  const answers = Array.isArray(attempt.answers) ? attempt.answers : [];
  const total = Number(attempt.totalQuestions);
  if (!Number.isInteger(total) || total < 1 || total > MAX_QUESTIONS_PER_ATTEMPT || answers.length !== total) {
    throw new Error('Số câu hỏi không hợp lệ.');
  }

  const attemptId = String(attempt.sessionId);

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

  const submittedAt = new Date();
  const row = [
    attemptId, String(attempt.learnerId), attemptNumber, submittedAt, correct, total, correct,
    Math.max(0, Number(attempt.durationSeconds) || 0), JSON.stringify(chapterScores),
    wrongIds.join(','), answered, Number(((correct / total) * 100).toFixed(1)), JSON.stringify(normalizedAnswers)
  ];
  return { row, answers: normalizedAnswers, submittedAt, correct };
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

function updateQuestionStatsBatch_(sheet, updates) {
  if (!updates.length) return;
  const lastRow = sheet.getLastRow();
  const rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 5).getValues() : [];
  const rowMap = new Map();
  rows.forEach((row, index) => rowMap.set(`${row[0]}:${row[1]}`, index));

  const changedRows = new Map();
  const newRows = [];
  updates.forEach(({ learnerId, answers, submittedAt }) => {
    answers.forEach(([questionId, selected, expected]) => {
      const key = `${learnerId}:${questionId}`;
      const isWrong = selected !== expected;
      const existingIndex = rowMap.get(key);
      if (existingIndex !== undefined) {
        const isNewRow = existingIndex >= rows.length;
        const newRowIndex = existingIndex - rows.length;
        const values = isNewRow
          ? newRows[newRowIndex].slice(2, 5)
          : changedRows.get(existingIndex) || rows[existingIndex].slice(2, 5);
        values[0] = (Number(values[0]) || 0) + (isWrong ? 1 : 0);
        values[1] = (Number(values[1]) || 0) + 1;
        if (isWrong) values[2] = submittedAt;
        if (isNewRow) newRows[newRowIndex] = [learnerId, questionId, ...values];
        else changedRows.set(existingIndex, values);
        return;
      }

      const newIndex = rows.length + newRows.length;
      newRows.push([learnerId, questionId, isWrong ? 1 : 0, 1, isWrong ? submittedAt : '']);
      rowMap.set(key, newIndex);
    });
  });

  const changedIndexes = [...changedRows.keys()].sort((a, b) => a - b);
  let groupStart = 0;
  while (groupStart < changedIndexes.length) {
    let groupEnd = groupStart;
    while (groupEnd + 1 < changedIndexes.length && changedIndexes[groupEnd + 1] === changedIndexes[groupEnd] + 1) {
      groupEnd++;
    }
    const startIndex = changedIndexes[groupStart];
    const groupValues = changedIndexes.slice(groupStart, groupEnd + 1).map(index => changedRows.get(index));
    sheet.getRange(startIndex + 2, 3, groupValues.length, 3).setValues(groupValues);
    groupStart = groupEnd + 1;
  }

  if (newRows.length) {
    sheet.getRange(lastRow + 1, 1, newRows.length, 5).setValues(newRows);
  }
}

function getHistoryResponse_(params) {
  const learnerId = String(params.learner_id || '');
  if (!/^nlkt-[\w-]{16,80}$/.test(learnerId)) return jsonResponse_({ ok: false, error: 'Mã người thi không hợp lệ.' });
  const requestedIds = new Set(String(params.attempt_ids || '').split(',').filter(id => /^[\w-]{1,80}$/.test(id)));
  const shouldCache = requestedIds.size === 0;
  const dataKey = historyCacheKey_(learnerId);
  const versionKey = `${dataKey}:version`;
  let cache = null;
  let initialVersion = '';

  if (shouldCache) {
    try {
      cache = CacheService.getScriptCache();
      initialVersion = cache.get(versionKey) || '0';
      const cached = cache.get(dataKey);
      if (cached) {
        const entry = JSON.parse(cached);
        if (entry.version === initialVersion && entry.data?.ok) {
          return historyResponse_(entry.data, params.callback);
        }
      }
    } catch (error) {
      cache = null;
    }
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(ATTEMPTS_SHEET_NAME);
  const attempts = [];
  const rows = sheet ? readAttemptRows_(sheet, learnerId, requestedIds) : [];
  rows.forEach(row => attempts.push({
    attempt_id: String(row[0]), attempt_number: Number(row[2]),
    submitted_at: new Date(row[3]).toISOString(), score: Number(row[4]),
    total_questions: Number(row[5]), correct_count: Number(row[6]),
    duration_seconds: Number(row[7]), chapter_scores: parseJson_(row[8], {}),
    wrong_question_ids: String(row[9] || '').split(',').filter(Boolean).map(Number),
    answered_count: Number(row[10]), accuracy_percent: Number(row[11])
  }));
  attempts.sort((a, b) => a.attempt_number - b.attempt_number);
  const statsSheet = spreadsheet.getSheetByName(QUESTION_STATS_SHEET_NAME);
  const data = {
    ok: true,
    attempts: requestedIds.size ? attempts : attempts.slice(-30),
    question_stats: requestedIds.size ? [] : getQuestionStatsForLearner_(statsSheet, learnerId)
  };
  if (cache) {
    try {
      if ((cache.get(versionKey) || '0') === initialVersion) {
        cache.put(dataKey, JSON.stringify({ version: initialVersion, data }), HISTORY_CACHE_TTL_SECONDS);
      }
    } catch (error) {
      // The cache is optional; the sheet response remains authoritative.
    }
  }
  return historyResponse_(data, params.callback);
}

function historyResponse_(data, callback) {
  callback = String(callback || '');
  if (callback) {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(callback)) return jsonResponse_({ ok: false, error: 'Callback không hợp lệ.' });
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonResponse_(data);
}

function historyCacheKey_(learnerId) {
  return `${HISTORY_CACHE_PREFIX}${learnerId}`;
}

function invalidateHistoryCache_(learnerId) {
  try {
    const cache = CacheService.getScriptCache();
    const key = historyCacheKey_(learnerId);
    cache.put(`${key}:version`, String(Date.now()), HISTORY_CACHE_TTL_SECONDS);
    cache.remove(key);
  } catch (error) {
    // Cache invalidation must never make a successfully saved attempt look like a failed write.
  }
}

function readAttemptRows_(sheet, learnerId, requestedIds) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  if (!requestedIds.size) {
    return sheet.getRange(2, 1, lastRow - 1, 13).getValues()
      .filter(row => String(row[1]) === learnerId);
  }

  // Confirmation requests usually contain one or a few attempt IDs. Scan the two key columns,
  // then read full records only for matching rows instead of transferring the whole history.
  const keys = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const rowIndexes = [];
  keys.forEach((row, index) => {
    if (String(row[1]) === learnerId && requestedIds.has(String(row[0]))) rowIndexes.push(index);
  });
  if (!rowIndexes.length) return [];

  const rows = [];
  let groupStart = rowIndexes[0];
  let groupEnd = groupStart;
  const readGroup = (start, end) => {
    rows.push(...sheet.getRange(start + 2, 1, end - start + 1, 13).getValues());
  };
  for (let index = 1; index < rowIndexes.length; index++) {
    const rowIndex = rowIndexes[index];
    if (rowIndex === groupEnd + 1) {
      groupEnd = rowIndex;
      continue;
    }
    readGroup(groupStart, groupEnd);
    groupStart = groupEnd = rowIndex;
  }
  readGroup(groupStart, groupEnd);
  return rows;
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
function parseJson_(value, fallback) {
  try { return JSON.parse(value); } catch (error) { return fallback; }
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}









