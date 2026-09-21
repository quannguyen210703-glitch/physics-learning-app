export const STARTUP_TIMEOUT_MS = 15000;

export const STARTUP_PHASES = Object.freeze({
  boot: 'boot',
  serviceWorker: 'service-worker',
  database: 'database',
  content: 'content',
  router: 'router',
  ready: 'ready'
});

export const withTimeout = (promise, { timeoutMs = STARTUP_TIMEOUT_MS, phase = STARTUP_PHASES.boot } = {}) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`Startup timeout tại phase ${phase} sau ${timeoutMs} ms.`);
      error.code = 'STARTUP_TIMEOUT';
      error.phase = phase;
      error.timeoutMs = timeoutMs;
      reject(error);
    }, timeoutMs);
  });
  return Promise.race([Promise.resolve(promise), timeout]).finally(() => clearTimeout(timer));
};

export const resolveAppBaseUrl = (documentUrl = globalThis.document?.baseURI ?? 'http://localhost/') => new URL('./', documentUrl).href;

export const startupDiagnostic = ({ error, phase, attempt, baseUrl, now = new Date().toISOString() }) => ({
  code: error?.code ?? 'STARTUP_ERROR',
  phase: error?.phase ?? phase,
  attempt,
  baseUrl,
  message: error?.message ?? String(error),
  timestamp: now
});

