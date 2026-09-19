import { put } from '../storage/database.js';
import { validateExam, validateQuestionBank } from './content-validator.js';

const fetchJson = async (path) => { const response = await fetch(path, { cache: 'no-store' }); if (!response.ok) throw new Error(`Không thể nạp ${path} (${response.status}).`); return response.json(); };

export async function loadContent() {
  const [catalog, concepts, errorTypes, version, questions, exam] = await Promise.all([
    fetchJson('./data/catalog.json'), fetchJson('./data/concepts.json'), fetchJson('./data/error-types.json'), fetchJson('./data/version.json'), fetchJson('./data/questions/questions.json'), fetchJson('./data/exams/diagnostic-10.json')
  ]);
  const questionReport = validateQuestionBank(questions), examReport = validateExam(exam, questions), errors = [...questionReport.errors, ...examReport.errors];
  if (errors.length) throw new Error(`Content validation failed:\n${errors.map((item) => `${item.path}: ${item.message}`).join('\n')}`);
  await put('contentMeta', { key: 'version', ...version, questionCount: questions.length, syncedAt: new Date().toISOString() });
  return { catalog, concepts, errorTypes, version, questions, exams: [exam] };
}

