import { ENTITY_SCHEMAS } from '../core/schema.js?v=2026.09.20.001';

const issue = (path, message) => ({ path, message });
const allowedSources = new Set(['teacher', 'imported', 'generated', 'variant']);
const normalizeText = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
const parseNumber = (value) => { const match = String(value ?? '').match(/-?\d+(?:[.,]\d+)?/); return match ? Number(match[0].replace(',', '.')) : NaN; };

export function validateQuestion(question, index = 0) {
  const errors = [], path = `questions[${index}]`;
  if (!question || typeof question !== 'object' || Array.isArray(question)) return [issue(path, 'Question phải là object.')];
  for (const key of ENTITY_SCHEMAS.question.required) {
    const nullableRelation = key === 'variantOf';
    if (question[key] === undefined || (!nullableRelation && question[key] === null) || question[key] === '') errors.push(issue(`${path}.${key}`, 'Thiếu trường bắt buộc.'));
  }
  if (question.id && !/^PHY\d{2}-[A-Z0-9-]+$/.test(question.id)) errors.push(issue(`${path}.id`, 'ID phải theo format PHY10-...'));
  if (question.difficulty !== undefined && (!Number.isInteger(question.difficulty) || question.difficulty < 1 || question.difficulty > 5)) errors.push(issue(`${path}.difficulty`, 'difficulty phải là số nguyên 1-5.'));
  if (!allowedSources.has(question.sourceType)) errors.push(issue(`${path}.sourceType`, 'sourceType không hợp lệ.'));
  if (typeof question.verified !== 'boolean') errors.push(issue(`${path}.verified`, 'verified phải là boolean.'));
  if (question.sourceType === 'generated' && question.sourceId === 'teacher') errors.push(issue(`${path}.sourceId`, 'Generated question không được giả mạo nguồn teacher.'));
  if (question.sourceType === 'variant' && !question.variantOf) errors.push(issue(`${path}.variantOf`, 'Variant question cần variantOf.'));
  if (!Array.isArray(question.options)) errors.push(issue(`${path}.options`, 'options phải là array.'));
  else {
    const ids = new Set();
    for (const [optionIndex, option] of question.options.entries()) {
      if (!option?.id || !option?.text) errors.push(issue(`${path}.options[${optionIndex}]`, 'Option cần id và text.'));
      if (ids.has(option?.id)) errors.push(issue(`${path}.options[${optionIndex}].id`, 'Option id bị trùng.'));
      ids.add(option?.id);
    }
    if (question.correctAnswer && !ids.has(question.correctAnswer)) errors.push(issue(`${path}.correctAnswer`, 'correctAnswer không tồn tại trong options.'));
  }
  for (const key of ['solutionSteps', 'commonErrors', 'prerequisites', 'tags', 'similarTo']) if (question[key] !== undefined && !Array.isArray(question[key])) errors.push(issue(`${path}.${key}`, `${key} phải là array.`));
  if (question.numericAnswer !== undefined && (!Number.isFinite(question.numericAnswer?.value) || !question.numericAnswer?.unit)) errors.push(issue(`${path}.numericAnswer`, 'numericAnswer cần value và unit hợp lệ.'));
  if (question.numericAnswer?.value !== undefined) {
    const answerOption = question.options?.find((option) => option.id === question.correctAnswer);
    if (!answerOption || !Number.isFinite(parseNumber(answerOption.text)) || Math.abs(parseNumber(answerOption.text) - question.numericAnswer.value) > 1e-9) errors.push(issue(`${path}.numericAnswer`, 'numericAnswer không khớp đáp án đúng.'));
  }
  return errors;
}

export function validateQuestionBank(questions) {
  if (!Array.isArray(questions)) return { valid: false, errors: [issue('questions', 'Question bank phải là array.')], questionCount: 0 };
  const errors = [], ids = new Set(), questionTexts = new Map(), optionSets = new Map(), duplicates = [];
  questions.forEach((question, index) => {
    errors.push(...validateQuestion(question, index));
    if (question?.id && ids.has(question.id)) { errors.push(issue(`questions[${index}].id`, 'Duplicate question id.')); duplicates.push({ type: 'duplicate-id', id: question.id, index }); }
    if (question?.id) ids.add(question.id);
    const textKey = normalizeText(question?.question);
    if (textKey && questionTexts.has(textKey)) duplicates.push({ type: 'duplicate-question-text', id: question.id, similarTo: questionTexts.get(textKey) });
    if (textKey) questionTexts.set(textKey, question?.id);
    const optionKey = (question?.options ?? []).map((option) => normalizeText(option?.text)).sort().join('|');
    if (optionKey && optionSets.has(optionKey)) duplicates.push({ type: 'same-option-set', id: question.id, similarTo: optionSets.get(optionKey) });
    if (optionKey) optionSets.set(optionKey, question?.id);
  });
  return { valid: errors.length === 0, errors, questionCount: questions.length, validQuestions: questions.length - new Set(errors.map((error) => error.path.match(/^questions\[(\d+)\]/)?.[1]).filter(Boolean)).size, duplicates };
}

export function validateExam(exam, questions) {
  const errors = [], ids = new Set((questions ?? []).map((question) => question.id));
  if (!exam?.id) errors.push(issue('exam.id', 'Thiếu exam id.'));
  if (!Array.isArray(exam?.questionIds)) errors.push(issue('exam.questionIds', 'questionIds phải là array.'));
  for (const id of exam?.questionIds ?? []) if (!ids.has(id)) errors.push(issue(`exam.questionIds[${id}]`, 'Exam tham chiếu question không tồn tại.'));
  return { valid: errors.length === 0, errors };
}
