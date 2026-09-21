import { openDatabase, resetDatabaseConnection } from './storage/database.js?v=2026.09.21.001';
import { ensureLocalStudent } from './storage/student-store.js?v=2026.09.21.001';
import { listAttempts } from './storage/attempt-store.js?v=2026.09.21.001';
import { loadContent } from './content/question-loader.js?v=2026.09.21.001';
import { createRouter } from './router.js?v=2026.09.21.001';
import { createDashboard } from './ui/dashboard.js?v=2026.09.21.001';
import { STARTUP_PHASES, STARTUP_TIMEOUT_MS, resolveAppBaseUrl, startupDiagnostic, withTimeout } from './core/startup.js?v=2026.09.21.001';

const root = document.querySelector('#app'), status = document.querySelector('#system-status');
const baseUrl = resolveAppBaseUrl(document.baseURI);
let attempt = 0;
let phase = STARTUP_PHASES.boot;
let bootPromise;
let routeHandlersWired = false;

const setPhase = (nextPhase, message) => {
  phase = nextPhase;
  window.__setStartupPhase?.(nextPhase, message);
};

const setStatus = (message, type = '') => { status.textContent = message; status.dataset.status = type; };

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return { supported: false };
  const scriptUrl = new URL('service-worker.js', baseUrl).href;
  try {
    const registration = await navigator.serviceWorker.register(scriptUrl, { scope: baseUrl });
    registration.update().catch((error) => console.warn('Service worker update unavailable', error));
    return { supported: true, registration };
  } catch (error) {
    console.warn('Service worker unavailable', error);
    return { supported: true, error };
  }
};

const renderFailure = (error) => {
  const failure = error instanceof Error ? error : new Error(String(error));
  const diagnostic = startupDiagnostic({ error: failure, phase, attempt, baseUrl });
  console.error('Startup failed', diagnostic);
  setStatus(`Không thể khởi tạo ứng dụng tại phase ${phase}.`, 'error');
  if (window.__showStartupFailure) window.__showStartupFailure(Object.assign(failure, { phase }), phase);
  else {
    root.replaceChildren();
    const section = document.createElement('section'); section.className = 'error';
    const title = document.createElement('h1'); title.textContent = 'Ứng dụng chưa sẵn sàng';
    const message = document.createElement('p'); message.textContent = failure.message;
    const retry = document.createElement('button'); retry.className = 'primary'; retry.textContent = 'Thử lại'; retry.addEventListener('click', () => startBootstrap());
    section.append(title, message, retry); root.append(section);
  }
};

async function bootstrap() {
  setPhase(STARTUP_PHASES.boot, 'Đang khởi tạo ứng dụng…');
  setPhase(STARTUP_PHASES.serviceWorker, 'Đang kiểm tra service worker…');
  await withTimeout(registerServiceWorker(), { timeoutMs: 3000, phase: STARTUP_PHASES.serviceWorker });
  setPhase(STARTUP_PHASES.database, 'Đang mở cơ sở dữ liệu học tập…');
  await withTimeout(openDatabase(), { timeoutMs: 5000, phase: STARTUP_PHASES.database });
  setPhase(STARTUP_PHASES.content, 'Đang chuẩn bị ngân hàng câu hỏi…');
  const [student, content] = await withTimeout(Promise.all([ensureLocalStudent(), loadContent()]), { timeoutMs: 10000, phase: STARTUP_PHASES.content });
  const attempts = await withTimeout(listAttempts(student.studentId), { timeoutMs: 3000, phase: STARTUP_PHASES.database });
  setPhase(STARTUP_PHASES.router, 'Đang khởi tạo giao diện học tập…');
  const dashboard = createDashboard(root, content, attempts), router = createRouter((route) => dashboard.render(route));
  if (!routeHandlersWired) {
    document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => router.navigate(button.dataset.route)));
    routeHandlersWired = true;
  }
  dashboard.render(router.current());
  setPhase(STARTUP_PHASES.ready, 'Đã sẵn sàng');
  setStatus(`Đã sẵn sàng · ${content.questions.length} câu hỏi · local data được bảo toàn`, 'success');
  window.__markAppReady?.();
}

function startBootstrap() {
  if (bootPromise) return bootPromise;
  attempt += 1;
  window.__setStartupAttempt?.(attempt);
  root.replaceChildren();
  bootPromise = withTimeout(bootstrap(), { timeoutMs: STARTUP_TIMEOUT_MS, phase: STARTUP_PHASES.boot })
    .catch((error) => { resetDatabaseConnection(); renderFailure(error); throw error; })
    .finally(() => { bootPromise = undefined; });
  bootPromise.catch(() => {});
  return bootPromise;
}

window.__appRetryHandler = () => { resetDatabaseConnection(); startBootstrap(); };
startBootstrap();
