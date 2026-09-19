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

Phase 1 có shared schemas, IndexedDB v1, local student store, question bank metadata, content validator, router và dashboard nền tảng. Exam, Mastery, Adaptive, Analytics và Offline sẽ được giao cho các agent tương ứng ở phase tiếp theo.
