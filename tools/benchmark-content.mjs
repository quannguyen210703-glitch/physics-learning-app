import { performance } from 'node:perf_hooks';
import { readFile } from 'node:fs/promises';
import { generatedQuestions } from '../js/content/generated-question-bank.js';
import { buildQuestionIndex } from '../js/content/question-index.js';

const seed = JSON.parse(await readFile(new URL('../data/questions/questions.json', import.meta.url), 'utf8'));
const base = [...seed, ...generatedQuestions];
const makeSynthetic = (count) => Array.from({ length: count }, (_, index) => ({ ...base[index % base.length], id: `PHY10-BENCH-${String(index).padStart(5, '0')}`, question: `${base[index % base.length].question} [benchmark ${index}]` }));
const measure = (questions) => {
  const start = performance.now();
  const index = buildQuestionIndex(questions);
  const buildMs = performance.now() - start;
  const queryStart = performance.now();
  for (let i = 0; i < 100; i += 1) index.query({ searchText: i % 2 ? 'newton' : 'energy', difficulty: String((i % 4) + 1) });
  return { records: questions.length, buildMs: Number(buildMs.toFixed(2)), hundredQueriesMs: Number((performance.now() - queryStart).toFixed(2)) };
};

console.log(JSON.stringify({ production100: measure(base), synthetic500: measure(makeSynthetic(500)), synthetic1000: measure(makeSynthetic(1000)) }, null, 2));
