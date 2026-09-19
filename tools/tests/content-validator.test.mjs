import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateExam, validateQuestion, validateQuestionBank } from '../../js/content/content-validator.js';
const read = async (path) => JSON.parse(await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'));
test('question bank mẫu hợp lệ', async () => { const questions = await read('data/questions/questions.json'); const report = validateQuestionBank(questions); assert.equal(report.valid, true); assert.equal(report.questionCount, 4); });
test('phát hiện question thiếu metadata', () => { const errors = validateQuestion({ id: 'PHY10-TEST-001', question: 'Test' }); assert.ok(errors.some((item) => item.path.endsWith('.concept'))); assert.ok(errors.some((item) => item.path.endsWith('.similarTo'))); });
test('phát hiện duplicate id và exam reference hỏng', async () => { const questions = await read('data/questions/questions.json'); assert.equal(validateQuestionBank([questions[0], questions[0]]).valid, false); assert.equal(validateExam({ id: 'EXAM-TEST', questionIds: ['PHY10-MISSING-001'] }, questions).valid, false); });
