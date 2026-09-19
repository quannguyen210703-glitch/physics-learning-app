import { put } from '../storage/database.js';
import { validateExam, validateQuestion, validateQuestionBank } from './content-validator.js';
import { buildQuestionIndex } from './question-index.js';
import { generatedQuestions } from './generated-question-bank.js';

const fetchJson = async (path) => { const response = await fetch(path, { cache: 'no-store' }); if (!response.ok) throw new Error(`Không thể nạp ${path} (${response.status}).`); return response.json(); };

export async function loadContent() {
  const [catalog, concepts, errorTypes, version, seedQuestions, exam] = await Promise.all([
    fetchJson('./data/catalog.json'), fetchJson('./data/concepts.json'), fetchJson('./data/error-types.json'), fetchJson('./data/version.json'), fetchJson('./data/questions/questions.json'), fetchJson('./data/exams/diagnostic-10.json')
  ]);
  const questions = [...seedQuestions, ...generatedQuestions];
  const questionReport = validateQuestionBank(questions);
  const validQuestions = questions.filter((question, index) => validateQuestion(question, index).length === 0);
  const examReport = validateExam(exam, validQuestions);
  if (!validQuestions.length) throw new Error('Không có câu hỏi hợp lệ để khởi tạo ngân hàng.');
  if (examReport.errors.length) throw new Error(`Exam validation failed:\n${examReport.errors.map((item) => `${item.path}: ${item.message}`).join('\n')}`);
  const difficultyDistribution = Object.fromEntries([1, 2, 3, 4, 5].map((difficulty) => [difficulty, validQuestions.filter((question) => question.difficulty === difficulty).length]));
  const derivedCatalog = { ...catalog, questionCount: validQuestions.length, verifiedQuestionCount: validQuestions.filter((question) => question.verified).length, reviewRequiredCount: validQuestions.filter((question) => !question.verified).length, topics: [...new Set(validQuestions.map((question) => question.topic))], concepts: [...new Set(validQuestions.map((question) => question.concept))], skills: [...new Set(validQuestions.map((question) => question.skill))], difficultyDistribution, lastUpdated: version.contentVersion };
  await put('contentMeta', { key: 'version', ...version, questionCount: validQuestions.length, syncedAt: new Date().toISOString() });
  return { catalog: derivedCatalog, concepts, errorTypes, version, questions: validQuestions, exams: [exam], index: buildQuestionIndex(validQuestions), validation: { ...questionReport, invalidQuestions: questions.length - validQuestions.length, reviewRequired: validQuestions.filter((question) => !question.verified).length } };
}

