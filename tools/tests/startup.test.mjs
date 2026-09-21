import test from 'node:test';
import assert from 'node:assert/strict';
import { STARTUP_PHASES, resolveAppBaseUrl, startupDiagnostic, withTimeout } from '../../js/core/startup.js';

test('startup timeout rejects with a readable phase diagnostic', async () => {
  await assert.rejects(
    withTimeout(new Promise(() => {}), { timeoutMs: 10, phase: STARTUP_PHASES.database }),
    (error) => error.code === 'STARTUP_TIMEOUT' && error.phase === STARTUP_PHASES.database
  );
});

test('startup timeout preserves successful operations', async () => {
  assert.equal(await withTimeout(Promise.resolve('ready'), { timeoutMs: 100, phase: STARTUP_PHASES.content }), 'ready');
});

test('app base path works for GitHub Pages and local hosting', () => {
  assert.equal(resolveAppBaseUrl('https://example.github.io/physics-learning-app/'), 'https://example.github.io/physics-learning-app/');
  assert.equal(resolveAppBaseUrl('http://localhost:4173/'), 'http://localhost:4173/');
  assert.equal(resolveAppBaseUrl('https://example.github.io/physics-learning-app/index.html'), 'https://example.github.io/physics-learning-app/');
});

test('startup diagnostic contains phase, attempt and base URL', () => {
  const diagnostic = startupDiagnostic({ error: Object.assign(new Error('database blocked'), { code: 'DB_BLOCKED' }), phase: STARTUP_PHASES.database, attempt: 2, baseUrl: 'https://example.test/app/', now: '2026-09-21T00:00:00.000Z' });
  assert.deepEqual(diagnostic, { code: 'DB_BLOCKED', phase: STARTUP_PHASES.database, attempt: 2, baseUrl: 'https://example.test/app/', message: 'database blocked', timestamp: '2026-09-21T00:00:00.000Z' });
});

