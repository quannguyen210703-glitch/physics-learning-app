# Physics Learning App V2 — Architecture

## Mục tiêu Phase 1

Phase 1 tạo nền tảng chạy được cho hệ thống học vật lý thích ứng:

- Question bank có metadata học tập, quan hệ câu hỏi và nguồn nội dung.
- IndexedDB có versioning để tách dữ liệu học sinh khỏi source/content update.
- UI nền tảng hiển thị trạng thái học tập, nội dung đã có và các learning mode.
- Các module được tách theo trách nhiệm để Exam, Adaptive, Error và Mastery Engine có thể bổ sung ở các phase tiếp theo.

## Luồng dữ liệu

```text
data/*.json
    ↓
question-loader → content-validator
    ↓                    ↓
IndexedDB content    validation report
    ↓
router → UI modules
    ↓
student-store / attempt-store → IndexedDB
```

## Module boundaries

| Boundary | Trách nhiệm | Phase |
| --- | --- | --- |
| `content/` | Nạp, validate và chuẩn hóa content tĩnh | 1 |
| `storage/` | Mở database, migration và persistence | 1 |
| `ui/` | Dashboard, question bank và navigation | 1 |
| `core/exam-engine.js` | Điều phối một phiên làm bài | 2 |
| `core/scoring-engine.js` | Chấm điểm bài làm | 2 |
| `core/error-engine.js` | Phân tích lỗi có bằng chứng | 3 |
| `core/mastery-engine.js` | Tính mastery theo nhiều cấp độ | 3 |
| `core/adaptive-engine.js` | Chọn hành động/câu tiếp theo | 3 |
| `core/review-engine.js` | Lập lịch ôn tập | 4 |

## Dữ liệu bền vững

App version và content version độc lập với `DB_VERSION`. Khi source được cập nhật, migration chỉ thay đổi schema cần thiết và không xóa `students`, `attempts`, `answers`, `mastery`, `errors` hoặc `reviewQueue`.

## Nguyên tắc mở rộng

1. Core learning không phụ thuộc AI API.
2. Không dùng điểm bài thi làm mastery trực tiếp.
3. Error chỉ là `possibleError` nếu dữ liệu chưa đủ để kết luận.
4. Câu hỏi phải có `concept`, `skill`, `difficulty`, `explanation` và source metadata.
5. Mọi content import phải qua validator trước khi được đưa vào question bank.

