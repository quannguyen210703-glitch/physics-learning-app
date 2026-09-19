import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateExam, validateQuestion, validateQuestionBank } from '../../js/content/content-validator.js';
import { generatedQuestions } from '../../js/content/generated-question-bank.js';
import { buildQuestionIndex } from '../../js/content/question-index.js';
const read = async (path) => JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
test('question bank mẫu hợp lệ', async () => { const questions = await read('data/questions/questions.json'); const report = validateQuestionBank(questions); assert.equal(report.valid, true); assert.equal(report.questionCount, 4); });
test('phát hiện question thiếu metadata', () => { const errors = validateQuestion({ id: 'PHY10-TEST-001', question: 'Test' }); assert.ok(errors.some((item) => item.path.endsWith('.concept'))); assert.ok(errors.some((item) => item.path.endsWith('.similarTo'))); });
test('phát hiện duplicate id và exam reference hỏng', async () => { const questions = await read('data/questions/questions.json'); assert.equal(validateQuestionBank([questions[0], questions[0]]).valid, false); assert.equal(validateExam({ id: 'EXAM-TEST', questionIds: ['PHY10-MISSING-001'] }, questions).valid, false); });
test('production bank có 100 câu hợp lệ, không trùng ID và có metadata generated', async () => {
  const seed = await read('data/questions/questions.json');
  const questions = [...seed, ...generatedQuestions];
  const report = validateQuestionBank(questions);
  assert.equal(questions.length, 100);
  assert.equal(report.valid, true);
  assert.equal(report.duplicates.length, 0);
  assert.equal(questions.filter((question) => question.sourceType === 'generated').length, 96);
  assert.ok(questions.every((question) => question.verified === true && question.explanation && question.solutionSteps.length));
});
test('question index truy vấn nhanh theo skill, difficulty và search token', async () => {
  const seed = await read('data/questions/questions.json');
  const index = buildQuestionIndex([...seed, ...generatedQuestions]);
  assert.equal(index.query({ skill: 'tinh-van-toc' }).length, 26);
  assert.ok(index.query({ difficulty: 4 }).length > 0);
  assert.ok(index.query({ searchText: 'newton' }).every((question) => question.tags.includes('newton')));
});
