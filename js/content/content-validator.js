import { ENTITY_SCHEMAS } from '../core/schema.js';

const issue = (path, message) => ({ path, message });
const allowedSources = new Set(['teacher', 'imported', 'generated', 'variant']);

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
  return errors;
}

export function validateQuestionBank(questions) {
  if (!Array.isArray(questions)) return { valid: false, errors: [issue('questions', 'Question bank phải là array.')], questionCount: 0 };
  const errors = [], ids = new Set();
  questions.forEach((question, index) => {
    errors.push(...validateQuestion(question, index));
    if (question?.id && ids.has(question.id)) errors.push(issue(`questions[${index}].id`, 'Duplicate question id.'));
    if (question?.id) ids.add(question.id);
  });
  return { valid: errors.length === 0, errors, questionCount: questions.length };
}

export function validateExam(exam, questions) {
  const errors = [], ids = new Set((questions ?? []).map((question) => question.id));
  if (!exam?.id) errors.push(issue('exam.id', 'Thiếu exam id.'));
  if (!Array.isArray(exam?.questionIds)) errors.push(issue('exam.questionIds', 'questionIds phải là array.'));
  for (const id of exam?.questionIds ?? []) if (!ids.has(id)) errors.push(issue(`exam.questionIds[${id}]`, 'Exam tham chiếu question không tồn tại.'));
  return { valid: errors.length === 0, errors };
}
