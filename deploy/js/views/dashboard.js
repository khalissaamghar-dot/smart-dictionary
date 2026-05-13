import { store } from '../store.js';

const CAT_ICONS = { physics: '⚛️', chemistry: '⚗️', biology: '🧬', mathematics: '📐', astronomy: '🔭', geology: '🌍', computer_science: '💻' };

export function renderDashboard() {
    const t = k => store.t(k);
    const state = store.state;
    const lang = state.lang;
    const words = state.dictionary;
    const user = state.user;

    const categories = [...new Set(words.map(w => w.category))];
    const recent = words.slice(0, 6);
    const favCount = state.favorites.length;

    const statCards = [
        { icon: 'book-open', label: t('dashboard.total_words'), value: words.length, color: 'var(--primary)', bg: '#eff6ff' },
        { icon: 'layers', label: t('dashboard.categories'), value: categories.length, color: '#8b5cf6', bg: '#f5f3ff' },
        { icon: 'star', label: t('dashboard.my_favorites'), value: favCount, color: '#f59e0b', bg: '#fffbeb' },
    ];

    const statsHtml = statCards.map(s => `
        <div class="glass-card" style="background:${s.bg};border-color:transparent;display:flex;align-items:center;gap:20px;padding:24px;">
            <div style="width:52px;height:52px;border-radius:16px;background:${s.color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${s.icon}" size="24" color="white"></i>
            </div>
            <div>
                <div style="font-size:2rem;font-weight:900;color:${s.color};line-height:1;">${s.value}</div>
                <div style="font-size:0.85rem;color:var(--text-muted);font-weight:600;margin-top:2px;">${s.label}</div>
            </div>
        </div>`).join('');

    const quickActions = [
        { icon: 'search', label: t('dashboard.explore'), route: 'dictionary', color: 'var(--primary)' },
        { icon: 'bot', label: t('dashboard.ask_ai'), route: 'chatbot', color: '#8b5cf6' },
        { icon: 'plus-circle', label: t('dashboard.add_term'), route: 'add-word', color: 'var(--secondary)' },
        { icon: 'gamepad-2', label: t('nav.games'), route: 'games', color: '#f59e0b' },
    ];

    const actionsHtml = quickActions.map(a => `
        <div onclick="window._navigate('${a.route}')" style="cursor:pointer;padding:20px;border-radius:18px;background:white;
            border:1.5px solid rgba(0,0,0,0.03);text-align:center;transition:all 0.3s;box-shadow:0 4px 15px rgba(0,0,0,0.03);"
            onmouseover="this.style.transform='translateY(-6px)';this.style.boxShadow='0 15px 30px rgba(0,0,0,0.08)'"
            onmouseout="this.style.transform='';this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)'">
            <div style="width:48px;height:48px;border-radius:14px;background:${a.color};display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                <i data-lucide="${a.icon}" size="22" color="white"></i>
            </div>
            <div style="font-weight:800;font-size:0.9rem;color:var(--text-main);">${a.label}</div>
        </div>`).join('');

    const recentHtml = recent.length === 0
        ? `<p style="color:var(--text-muted);">No terms yet.</p>`
        : recent.map(word => {
            const d = word.translations?.[lang] || word.translations?.['en'] || {};
            const isFav = store.isFavorite(word.id);
            return `
                <div class="mini-card" onclick="window._navigate('dictionary')"
                    style="display:flex;align-items:flex-start;gap:14px;padding:18px;">
                    <div style="font-size:1.5rem;flex-shrink:0;">${CAT_ICONS[word.category] || '🔬'}</div>
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                            <div style="font-weight:800;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.word || '—'}</div>
                            <button onclick="event.stopPropagation();store.toggleFavorite('${word.id}')"
                                style="border:none;background:none;cursor:pointer;color:${isFav ? '#f59e0b' : '#cbd5e1'};flex-shrink:0;padding:0;">
                                <i data-lucide="star" size="16" fill="${isFav ? '#f59e0b' : 'none'}"></i>
                            </button>
                        </div>
                        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:3px;text-transform:capitalize;">${word.category}</div>
                        <div style="font-size:0.82rem;color:#475569;margin-top:6px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                            ${d.definition || ''}
                        </div>
                    </div>
                </div>`;
        }).join('');

    const greeting = user?.name ? `${t('dashboard.welcome')}, ${user.name}! 👋` : `${t('dashboard.welcome')}! 👋`;

    const template = `
        <div style="animation:fadeIn 0.5s ease-out;">
            <div style="margin-bottom:30px;">
                <h1 style="font-size:1.9rem;font-weight:900;">${greeting}</h1>
                <p style="color:var(--text-muted);margin-top:5px;">Your scientific knowledge hub across 4 languages.</p>
            </div>

            <!-- Stats -->
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:30px;">
                ${statsHtml}
            </div>

            <!-- Quick Actions -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:35px;">
                ${actionsHtml}
            </div>

            <!-- Recent Terms -->
            <div>
                <h2 class="section-title">
                    <i data-lucide="clock" size="22" color="var(--primary)"></i>
                    ${t('dashboard.recent')}
                </h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
                    ${recentHtml}
                </div>
            </div>
        </div>`;

    return {
        template,
        init: () => { if (window.lucide) window.lucide.createIcons(); }
    };
}
