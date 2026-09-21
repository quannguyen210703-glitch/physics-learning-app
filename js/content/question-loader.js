import { put } from '../storage/database.js?v=2026.09.21.001';
import { validateExam, validateQuestion, validateQuestionBank } from './content-validator.js?v=2026.09.21.001';
import { buildQuestionIndex } from './question-index.js?v=2026.09.21.001';
import { generatedQuestions } from './generated-question-bank.js?v=2026.09.21.001';

export const CONTENT_LOAD_TIMEOUT_MS = 8000;
const appBaseUrl = new URL('../../', import.meta.url);

export const fetchJson = async (path, timeoutMs = CONTENT_LOAD_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = new URL(path.replace(/^\.\//, ''), appBaseUrl).href;
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error(`Không thể nạp ${path} (${response.status}).`);
    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') { const timeoutError = new Error(`Nạp ${path} quá thời gian sau ${timeoutMs} ms.`); timeoutError.code = 'CONTENT_TIMEOUT'; throw timeoutError; }
    throw error;
  } finally { clearTimeout(timer); }
};

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
