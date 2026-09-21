# BOOT-001 — Startup Quality Gate

STATUS: PASS (local quality-gate evidence complete)

## Scope

- Startup watchdog with a 15-second global timeout and phase-specific timeouts.
- Inline error boundary that remains available even when the module bootstrap fails.
- Retry action with attempt number, phase, base path, error code and timestamp diagnostics.
- GitHub Pages-safe asset resolution from `document.baseURI` and `import.meta.url`.
- IndexedDB schema migration from version 1 to version 2 without deleting existing stores or student data.
- Content fetch abort timeout and explicit service-worker registration/update handling.
- Versioned app-shell cache with stale-cache cleanup and safe offline fallbacks.

## Test matrix

| Test | Result | Evidence |
| --- | --- | --- |
| First visit | PASS | Fresh origin `localhost:4174` reached `Đã sẵn sàng` |
| Refresh | PASS | Reload on `localhost:4174` reached `Đã sẵn sàng` |
| Hard refresh | PASS | `Control+Shift+R` on `localhost:4174` reached `Đã sẵn sàng` |
| Direct route | PASS | `/#/question-bank` rendered 100 questions and pagination |
| Empty IndexedDB | PASS | Fresh origin created student/database and booted |
| Existing IndexedDB | PASS | Second load preserved local data and booted |
| Old IndexedDB schema | PASS | Version-1 fixture migrated to DB version 2 and booted |
| Old Service Worker | PASS | Old fixture worker was replaced by the versioned worker |
| Offline reload | PASS | Server stopped; cached app booted from service-worker cache |
| App update | PASS | Versioned app shell installed after old worker and booted |
| Failed content request | PASS | 503 rendered readable content-phase error and retry action |
| Hanging content request | PASS | Request aborted after 8 seconds; no infinite loading |

## Automated checks

- `node --test tools/tests/*.test.mjs`: 10 passed, 0 failed.
- `node tools/validate-content.mjs`: 100 questions valid, 4 exam references valid.
- JavaScript syntax checks: PASS.

## Gate decision

BOOT-001 is PASS. Foundation, Content, Exam, Scoring, Mastery, Roadmap, Adaptive, Analytics and final release gates remain unchanged and must be evaluated separately with evidence.

