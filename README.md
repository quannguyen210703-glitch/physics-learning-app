# Physics Learning App V2

Adaptive Physics Learning System — Phase 1 Foundation.

## Chạy local

App dùng `fetch` để nạp JSON nên chạy qua static server:

```bash
python -m http.server 4173
```

Mở `http://localhost:4173`.

## Kiểm tra

```bash
npm test
npm run validate:content
```

Phase 1 có shared schemas, IndexedDB v2 với migration bảo toàn dữ liệu, local student store, question bank metadata, content validator, router và dashboard nền tảng. BOOT-001 đã PASS với watchdog startup, error boundary, retry, stale-cache recovery và offline reload evidence. Exam, Mastery, Adaptive và Analytics sẽ được giao sau khi Foundation/Content QA hoàn tất.
