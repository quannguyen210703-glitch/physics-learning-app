export const DB_NAME = 'physics-learning-app-v2';
export const DB_VERSION = 2;

const DEFINITIONS = {
  students: ['studentId', [['updatedAt', 'updatedAt']]],
  attempts: ['attemptId', [['studentId', 'studentId'], ['submittedAt', 'submittedAt']]],
  answers: ['answerId', [['attemptId', 'attemptId'], ['questionId', 'questionId'], ['studentId', 'studentId']]],
  mastery: ['masteryId', [['studentId', 'studentId'], ['dimensionId', 'dimensionId'], ['dimensionType', 'dimensionType']]],
  errors: ['errorId', [['studentId', 'studentId'], ['skill', 'skill'], ['errorType', 'errorType']]],
  reviewQueue: ['reviewId', [['studentId', 'studentId'], ['nextReviewAt', 'nextReviewAt'], ['status', 'status']]],
  settings: ['key', []],
  questionProgress: ['progressId', [['studentId', 'studentId'], ['questionId', 'questionId']]],
  contentMeta: ['key', []]
};

let openPromise;
const requestPromise = (request) => new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });

const ensureDefinitions = (db, transaction) => {
  for (const [name, [keyPath, indexes]] of Object.entries(DEFINITIONS)) {
    const store = db.objectStoreNames.contains(name) ? transaction.objectStore(name) : db.createObjectStore(name, { keyPath });
    for (const [indexName, indexPath] of indexes) if (!store.indexNames.contains(indexName)) store.createIndex(indexName, indexPath, { unique: false });
  }
};

export function openDatabase() {
  if (openPromise) return openPromise;
  openPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) return reject(new Error('Trình duyệt không hỗ trợ IndexedDB.'));
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      ensureDefinitions(db, event.target.transaction);
      if (event.oldVersion < 2) event.target.transaction.objectStore('settings').put({ key: 'schemaVersion', version: DB_VERSION, migratedAt: new Date().toISOString() });
    };
    request.onblocked = () => { const error = new Error('IndexedDB đang bị khóa bởi tab cũ. Đóng tab cũ rồi thử lại.'); error.code = 'DB_BLOCKED'; reject(error); };
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    request.onerror = () => reject(request.error ?? new Error('Không thể mở IndexedDB.'));
  });
  openPromise.catch(() => { openPromise = undefined; });
  return openPromise;
}

export function resetDatabaseConnection() { openPromise = undefined; }

export async function get(storeName, key) { const db = await openDatabase(); return requestPromise(db.transaction(storeName).objectStore(storeName).get(key)); }
export async function getAll(storeName) { const db = await openDatabase(); return requestPromise(db.transaction(storeName).objectStore(storeName).getAll()); }
export async function count(storeName) { const db = await openDatabase(); return requestPromise(db.transaction(storeName).objectStore(storeName).count()); }
export async function put(storeName, value) { const db = await openDatabase(); return requestPromise(db.transaction(storeName, 'readwrite').objectStore(storeName).put(value)); }
