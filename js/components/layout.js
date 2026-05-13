import { store } from '../store.js';

const NAV_ITEMS = [
    { route: 'dashboard', icon: 'layout-dashboard', key: 'nav.dashboard' },
    { route: 'dictionary', icon: 'book-open', key: 'nav.dictionary' },
    { route: 'chatbot', icon: 'bot', key: 'nav.chatbot' },
    { route: 'games', icon: 'gamepad-2', key: 'nav.games' },
    { route: 'tools', icon: 'wrench', key: 'nav.tools' },
    { route: 'favorites', icon: 'star', key: 'nav.favorites' },
    { route: 'add-word', icon: 'plus-circle', key: 'nav.add_word' },
];

const LANG_SYMBOLS = { en: 'EN', fr: 'FR', ar: 'ع', zgh: 'ⵣ' };

export function renderLayout(state, currentRoute) {
    const t = k => store.t(k);
    const user = state.user;
    const isAdmin = user?.role === 'admin' || user?.role === 'teacher';
    const isRTL = state.lang === 'ar';

    const navItems = [...NAV_ITEMS];
    if (isAdmin) navItems.push({ route: 'admin', icon: 'shield-check', key: 'nav.admin' });
    navItems.push({ route: 'profile', icon: 'user', key: 'nav.profile' });
    navItems.push({ route: 'settings', icon: 'settings', key: 'nav.settings' });

    const navHtml = navItems.map(item => {
        const active = currentRoute === item.route ? 'active' : '';
        return `
            <div class="nav-item ${active}" data-route="${item.route}" onclick="window._navigate('${item.route}')" title="${t(item.key)}">
                <i data-lucide="${item.icon}" size="20"></i>
                <span>${t(item.key)}</span>
            </div>`;
    }).join('');

    const langBtns = Object.entries(LANG_SYMBOLS).map(([code, symbol]) => `
        <button class="lang-btn ${state.lang === code ? 'active' : ''}" onclick="window._setLang('${code}')" title="${code.toUpperCase()}"
            style="padding:6px 10px;border:none;border-radius:10px;cursor:pointer;font-weight:800;font-size:0.75rem;
            background:${state.lang === code ? 'var(--primary)' : 'rgba(255,255,255,0.6)'};
            color:${state.lang === code ? 'white' : 'var(--text-muted)'};transition:all 0.2s;">
            ${symbol}
        </button>`).join('');

    const userRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '';
    const initials = (user?.name?.[0] || 'U') + (user?.lastName?.[0] || '');

    return `
        <div class="layout-sidebar">
            <!-- Brand -->
            <div class="brand-container" style="margin-bottom:30px;text-align:center;">
                <img src="img/logo.png" alt="Smart Scientific Dictionary Logo"
                    style="width:100%;max-height:180px;height:auto;object-fit:contain;
                           display:block;margin:0 auto;">
            </div>

            <!-- Language Switcher -->
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:20px;justify-content:center;">
                ${langBtns}
            </div>

            <!-- Navigation -->
            <nav style="flex:1;overflow-y:auto;">
                ${navHtml}
            </nav>

            <!-- User Profile + Logout -->
            <div style="border-top:1px solid var(--glass-border);padding-top:20px;margin-top:10px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));
                        display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:0.9rem;flex-shrink:0;">
                        ${initials.toUpperCase()}
                    </div>
                    <div style="flex:1;overflow:hidden;">
                        <div style="font-weight:700;font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user?.name || 'User'}</div>
                        <div style="font-size:0.7rem;color:var(--text-muted);">${userRole}</div>
                    </div>
                    <button onclick="store.logout()" class="btn" title="${t('nav.logout')}" style="padding:8px;background:rgba(239,68,68,0.08);color:#ef4444;border-radius:8px;flex-shrink:0;">
                        <i data-lucide="log-out" size="18"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="layout-main" id="main-content">
            <div style="flex:1;overflow-y:auto;padding:35px;" id="view-container">
                <div style="display:flex;align-items:center;justify-content:center;height:200px;">
                    <div style="text-align:center;color:var(--text-muted);">
                        <i data-lucide="loader" size="40" style="animation:spin 1s linear infinite;"></i>
                        <p style="margin-top:10px;">${t('common.loading')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
