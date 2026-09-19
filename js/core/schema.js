export const ENTITY_SCHEMAS = Object.freeze({
  question: {
    required: ['id', 'subject', 'grade', 'chapter', 'topic', 'concept', 'skill', 'difficulty', 'questionType', 'question', 'options', 'correctAnswer', 'explanation', 'solutionSteps', 'formula', 'commonErrors', 'prerequisites', 'tags', 'sourceType', 'sourceId', 'variantOf', 'similarTo', 'verified']
  },
  exam: { required: ['id', 'title', 'questionIds', 'contentVersion'] },
  attempt: { required: ['attemptId', 'studentId', 'mode', 'startedAt', 'answers'] },
  student: { required: ['studentId', 'displayName', 'createdAt', 'updatedAt'] },
  mastery: { required: ['masteryId', 'studentId', 'dimensionType', 'dimensionId', 'score', 'status', 'updatedAt'] },
  error: { required: ['errorId', 'studentId', 'errorType', 'concept', 'skill', 'wrongCount', 'lastSeen', 'status'] },
  reviewQueue: { required: ['reviewId', 'studentId', 'targetType', 'targetId', 'nextReviewAt', 'reviewPriority', 'reviewCount', 'status'] }
});

export const DEFAULT_MASTERY_CONFIG = Object.freeze({
  initialScore: 50,
  improvingThreshold: 60,
  stableThreshold: 75,
  masteredThreshold: 90,
  stableCorrectStreak: 2,
  masteredCorrectStreak: 3
});

export const nowIso = () => new Date().toISOString();
export const createId = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;

