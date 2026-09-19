import { readFile } from 'node:fs/promises';
import { validateExam, validateQuestionBank } from '../js/content/content-validator.js';
const read = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const questions = await read('data/questions/questions.json');
const exam = await read('data/exams/diagnostic-10.json');
const errors = [...validateQuestionBank(questions).errors, ...validateExam(exam, questions).errors];
if (errors.length) { console.error(errors.map((item) => `${item.path}: ${item.message}`).join('\n')); process.exitCode = 1; } else console.log(`Content valid: ${questions.length} questions, ${exam.questionIds.length} exam references.`);
