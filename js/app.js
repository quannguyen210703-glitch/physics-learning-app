import { openDatabase } from './storage/database.js?v=2026.09.20.001';
import { ensureLocalStudent } from './storage/student-store.js?v=2026.09.20.001';
import { listAttempts } from './storage/attempt-store.js?v=2026.09.20.001';
import { loadContent } from './content/question-loader.js?v=2026.09.20.001';
import { createRouter } from './router.js?v=2026.09.20.001';
import { createDashboard } from './ui/dashboard.js?v=2026.09.20.001';

const root = document.querySelector('#app'), status = document.querySelector('#system-status');
const setStatus = (message, type = '') => { status.textContent = message; status.dataset.status = type; };

async function bootstrap() {
  try {
    setStatus('Đang chuẩn bị ngân hàng câu hỏi…');
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch((error) => console.warn('Service worker unavailable', error));
    await openDatabase();
    const [student, content] = await Promise.all([ensureLocalStudent(), loadContent()]);
    const attempts = await listAttempts(student.studentId);
    const dashboard = createDashboard(root, content, attempts), router = createRouter((route) => dashboard.render(route));
    document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => router.navigate(button.dataset.route)));
    dashboard.render(router.current());
    setStatus(`Đã sẵn sàng · ${content.questions.length} câu hỏi · local data được bảo toàn`, 'success');
  } catch (error) {
    console.error(error);
    setStatus('Không thể tải dữ liệu câu hỏi.', 'error');
    root.innerHTML = `<section class="error"><b>!</b><h1>Không thể khởi tạo app</h1><p>${error.message}</p><button class="primary" data-retry>Thử lại</button></section>`;
    root.querySelector('[data-retry]').addEventListener('click', () => location.reload());
  }
}
bootstrap();

