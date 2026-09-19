# OFFLINE

STATUS: NOT STARTED  
PROGRESS: 0%  
DONE: Persistence requirement documented.  
REMAINING: Service worker, cache and update migrations.  
TESTS: NOT RUN  
ISSUES: Depends on FOUNDATION versioning.

## OFFLINE-001 CHECKPOINT — 2026-09-20

STATUS: IMPLEMENTED FOR CONTENT UPDATE MILESTONE
DONE: `service-worker.js` uses a content-versioned cache, network-first data requests, offline cache fallback, app-shell precache and cleanup of stale caches. `app.js` registers it without blocking bootstrap. IndexedDB student stores remain separate and are not deleted during content updates.
CONTENT VERSION: `2026.09.20.001`
REMAINING: Full device/offline regression and migration QA in the broader release gate.
LAST COMMIT: NONE

