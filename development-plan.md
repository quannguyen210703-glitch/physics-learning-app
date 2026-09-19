# Development Plan

## Phase 1 — Foundation (đang triển khai)

- [x] Kiến trúc modular và tài liệu schema.
- [x] Question schema, attempt schema, mastery schema, error schema, review queue schema.
- [x] Question bank mẫu và catalog.
- [x] IndexedDB version 1 với migration an toàn.
- [x] Dashboard nền tảng và question bank browser.
- [x] Content validator và test tự động.

## Phase 2 — Exam Engine

- [ ] Exam loader và session state.
- [ ] Trả lời, bỏ qua, timer và phục hồi phiên.
- [ ] Scoring engine và lưu attempt/answer.

## Phase 3 — Adaptive Core

- [ ] Error analysis với `possibleError`.
- [ ] Mastery update theo chapter/topic/concept/skill.
- [ ] Adaptive question selection và câu thay thế.

## Phase 4 — Review

- [ ] Wrong Question Review.
- [ ] Adaptive Practice.
- [ ] Mastery Test với biến thể câu hỏi.
- [ ] Review queue và spaced review.

## Phase 5 — Analytics

- [ ] Phân tích accuracy, response time, repeated errors và improvement.
- [ ] Dashboard tiến bộ theo thời gian.

## Phase 6 — PWA & Updates

- [ ] Service worker cache-first cho content đã tải.
- [ ] Offline fallback.
- [ ] Content update không làm mất dữ liệu IndexedDB.

## Phase 7 — Content Import

- [ ] Parse PDF/DOCX/JSON/TXT.
- [ ] Normalize, assign IDs, detect duplicates và build exam JSON.
- [ ] CI validate trước commit/push.

