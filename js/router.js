const routes = new Set(['dashboard', 'question-bank', 'architecture']);
export function createRouter(onRouteChange) {
  const current = () => { const route = location.hash.replace(/^#\/?/, '') || 'dashboard'; return routes.has(route) ? route : 'dashboard'; };
  addEventListener('hashchange', () => onRouteChange(current()));
  return { current, navigate: (route) => { const next = routes.has(route) ? route : 'dashboard'; location.hash = next; onRouteChange(next); } };
}

