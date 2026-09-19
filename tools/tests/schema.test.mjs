import test from 'node:test';
import assert from 'node:assert/strict';
import { ENTITY_SCHEMAS, DEFAULT_MASTERY_CONFIG } from '../../js/core/schema.js';
test('shared schema có đủ entity và mastery thresholds', () => { for (const entity of ['question', 'exam', 'attempt', 'student', 'mastery', 'error', 'reviewQueue']) assert.ok(ENTITY_SCHEMAS[entity]); assert.equal(DEFAULT_MASTERY_CONFIG.masteredCorrectStreak, 3); });
