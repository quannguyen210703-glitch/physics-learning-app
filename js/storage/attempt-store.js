import { getAll, put } from './database.js';

export async function saveAttempt(attempt) {
  await put('attempts', attempt);
  for (const answer of attempt.answers ?? []) await put('answers', { ...answer, attemptId: attempt.attemptId, studentId: attempt.studentId });
  return attempt;
}

export async function listAttempts(studentId) {
  const attempts = await getAll('attempts');
  return attempts.filter((item) => item.studentId === studentId).sort((a, b) => (b.startedAt ?? '').localeCompare(a.startedAt ?? ''));
}

