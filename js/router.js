import { store } from './store.js';
import { renderLayout } from './components/layout.js';

// Views
import { renderAuth } from './views/auth.js';
import { renderDashboard } from './views/dashboard.js';
import { renderDictionary } from './views/dictionary_v2.js';
import { renderChatbot } from './views/chatbot.js';
import { renderFavorites } from './views/favorites.js';
import { renderAddWord } from './views/add-word.js';
import { renderProfile } from './views/profile.js';
import { renderSettings } from './views/settings.js';
import { renderGames } from './views/games.js';
import { renderTools } from './views/tools.js';
import { renderAdmin } from './views/admin.js';

const routes = {
    'login': { render: renderAuth, public: true },
    'register': { render: renderAuth, public: true },
    'dashboard': { render: renderDashboard },
    'dictionary': { render: renderDictionary },
    'chatbot': { render: renderChatbot },
    'games': { render: renderGames },
    'tools': { render: renderTools },
    'favorites': { render: renderFavorites },
    'add-word': { render: renderAddWord },
    'profile': { render: renderProfile },
    'settings': { render: renderSettings },
    'admin': { render: renderAdmin, role: 'admin' }
};

export function handleRoute() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const [path, query] = hash.split('?');
    
    console.log(`[Router] Routing to: ${path}`);

    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // Auth Check
    if (!store.state.authLoaded) {
        console.log('[Router] Auth not loaded yet, showing loader...');
        if (!appContainer.innerHTML.trim()) {
            appContainer.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;font-family:sans-serif;">
                    <div class="loader"></div>
                    <p style="margin-top:20px;color:#64748b;font-weight:600;">Securely loading your library...</p>
                    <style>
                        .loader { width:48px;height:48px;border:5px solid #e2e8f0;border-bottom-color:#1e40af;border-radius:50%;display:inline-block;animation:rotation 1s linear infinite; }
                        @keyframes rotation { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
                    </style>
                </div>`;
        }
        return;
    }

    const route = routes[path] || routes['dashboard'];

    // Auth Guard
    if (!route.public && !store.state.user) {
        window.location.hash = '#login';
        return;
    }

    // Role Guard
    if (route.role && store.state.user?.role !== route.role) {
         const isAdmin = store.state.user?.role === 'admin' || store.state.user?.role === 'teacher';
         if (!isAdmin) {
            window.location.hash = '#dashboard';
            return;
         }
    }

    try {
        const result = route.render(path);
        const template = typeof result === 'string' ? result : result.template;
        const init = result.init || (() => {});

        if (route.public) {
            appContainer.innerHTML = template;
            appContainer.classList.remove('with-sidebar');
            init();
        } else {
            // Layout with sidebar
            if (!appContainer.querySelector('.layout-sidebar')) {
                appContainer.innerHTML = renderLayout(store.state, path);
                appContainer.classList.add('with-sidebar');
            }

            const viewContainer = document.getElementById('view-container');
            if (viewContainer) {
                viewContainer.innerHTML = template;
                init();
            }

            // Update active nav state
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.toggle('active', el.dataset.route === path);
            });
        }

        if (window.lucide) window.lucide.createIcons();
    } catch (error) {
        console.error(`[Router] Render Error for ${path}:`, error);
        appContainer.innerHTML = `<div style="padding:40px;color:red;">Error loading page: ${error.message}</div>`;
    }
}

window.addEventListener('hashchange', handleRoute);
window._navigate = (path) => { window.location.hash = '#' + path; };
window._rerender = () => handleRoute();
window._setLang = (lang) => {
    store.setLang(lang);
    const appContainer = document.getElementById('app');
    if (appContainer) appContainer.innerHTML = ''; 
    handleRoute();
};
