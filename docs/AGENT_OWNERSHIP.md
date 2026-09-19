# Agent Ownership

Mỗi module có một owner chính. Agent khác không tự sửa module thuộc owner khác; nếu cần thay đổi contract phải gửi `REQUEST CROSS-AGENT CHANGE` cho Orchestrator.

| Agent | Owned scope | Primary files |
| --- | --- | --- |
| FOUNDATION_AGENT | architecture, bootstrap, router, shared contracts, database foundation, versioning | `architecture.md`, `development-plan.md`, `PROJECT_STATUS.md` (Orchestrator-owned), `js/core/schema.js`, `js/storage/`, `js/router.js`, `js/app.js`, `config/` |
| EXAM_AGENT | exam session, answer flow, timer, autosave, scoring, attempts | `js/core/exam-engine.js`, `js/core/scoring-engine.js`, `js/content/exam-loader.js`, `js/ui/exam.js`, `js/ui/result.js` |
| MASTERY_AGENT | error tracking and mastery state transitions | `js/core/mastery-engine.js`, `js/core/error-engine.js` |
| ADAPTIVE_AGENT | next-question selection, variants, prerequisites, review scheduling | `js/core/adaptive-engine.js`, `js/core/review-engine.js`, `js/ui/review.js` |
| ANALYTICS_AGENT | read-only learning dashboard and analytics | `js/ui/dashboard.js`, `js/ui/analytics.js` |
| OFFLINE_AGENT | PWA, service worker, cache/update/migration policy | `service-worker.js`, `manifest.json`, `js/core/update-engine.js` |
| CONTENT_AGENT | question bank, exam bank, imports, validation, catalog | `data/`, `js/content/question-loader.js`, `js/content/content-validator.js`, `tools/` |
| QA_AGENT | verification only; no feature ownership | `tools/tests/`, `docs/qa/` |

## Shared contracts

`Question`, `Exam`, `Attempt`, `Student`, `Mastery`, `ErrorProfile` and `ReviewQueue` are shared contracts. Changes require impact review against all consumers and regression tests before merge.

## Git rule

Agents do not commit or push. The Orchestrator reviews output, runs the relevant tests, updates `PROJECT_STATUS.md`, then commits using `[TAB] description` and pushes only when requested/approved by the workflow.

