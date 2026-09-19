# TASK BOARD — PHYSICS LEARNING APP V2

The board is evidence-based. `PASS` requires implementation evidence, test evidence, and QA evidence where the task is feature-critical. A dependency in the Blocker column means the task remains paused until that task is ready.

| Task ID | Tab | Agent | Status | Progress | QA | Commit | Blocker |
|---|---|---|---|---:|---|---|---|
| FOUNDATION-001 | FOUNDATION | 01_FOUNDATION_AGENT | IN PROGRESS | 60% | BLOCKED | - | CONTENT-001 |
| EXAM-001 | EXAM | 02_EXAM_AGENT | NOT STARTED | 0% | - | - | FOUNDATION-001 |
| MASTERY-001 | MASTERY | 03_MASTERY_AGENT | NOT STARTED | 0% | - | - | FOUNDATION-001 |
| ADAPTIVE-001 | ADAPTIVE | 04_ADAPTIVE_AGENT | NOT STARTED | 0% | - | - | MASTERY-001, CONTENT-001 |
| ANALYTICS-001 | ANALYTICS | 05_ANALYTICS_AGENT | NOT STARTED | 0% | - | - | EXAM-001, MASTERY-001 |
| OFFLINE-001 | OFFLINE | 06_OFFLINE_AGENT | NOT STARTED | 0% | - | - | FOUNDATION-001 |
| CONTENT-001 | CONTENT | 07_CONTENT_AGENT | FAIL | 80% | FAIL | - | `variantOf: null` rejected by validator |
| QA-001 | QA | 08_QA_AGENT | NOT STARTED | 0% | - | - | All feature tasks |

## BOARD RULES

- Handoff goes through `00_ORCHESTRATOR_AGENT`.
- A failed task stays with its owner; the owner receives the required fix.
- A blocked task is paused and its dependency is activated first.
- Progress is derived from task evidence, not chat claims or subjective estimates.
