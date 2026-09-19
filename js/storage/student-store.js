import { get, put } from './database.js';
import { nowIso } from '../core/schema.js';

export const LOCAL_STUDENT_ID = 'student-local-001';

export async function ensureLocalStudent() {
  const current = await get('students', LOCAL_STUDENT_ID);
  if (current) return current;
  const student = { studentId: LOCAL_STUDENT_ID, displayName: 'Học sinh', grade: 10, createdAt: nowIso(), updatedAt: nowIso() };
  await put('students', student);
  return student;
}

