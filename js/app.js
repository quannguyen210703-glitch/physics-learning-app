import { openDatabase, count } from './storage/database.js';
import { ensureLocalStudent } from './storage/student-store.js';
import { listAttempts } from './storage/attempt-store.js';
import { loadContent } from './content/question-loader.js';
import { createRouter } from './router.js';
import { createDashboard } from './ui/dashboard.js';

const root = document.querySelector('#app'), status = document.querySelector('#system-status');
const setStatus = (message, type = '') => { status.textContent = message; status.dataset.status = type; };

async function bootstrap() {
  try {
    setStatus('Đang khởi tạo dữ liệu…');
    await openDatabase();
    const [student, content] = await Promise.all([ensureLocalStudent(), loadContent()]);
    const attempts = await listAttempts(student.studentId);
    const dashboard = createDashboard(root, content, attempts), router = createRouter((route) => dashboard.render(route));
    document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => router.navigate(button.dataset.route)));
    dashboard.render(router.current());
    setStatus(`Đã sẵn sàng · ${content.questions.length} câu hỏi · local data được bảo toàn`, 'success');
  } catch (error) {
    console.error(error);
    setStatus(error.message, 'error');
    root.innerHTML = `<section class="error"><b>!</b><h1>Không thể khởi tạo app</h1><p>${error.message}</p><button class="primary" onclick="location.reload()">Thử lại</button></section>`;
  }
}
bootstrap();

