import { store } from '../store.js';

const CAT_COLORS = { physics:'#3b82f6',chemistry:'#10b981',biology:'#8b5cf6',mathematics:'#f59e0b',astronomy:'#6366f1',geology:'#78716c',computer_science:'#0ea5e9' };

export function renderFavorites() {
    const t = k => store.t(k);
    const state = store.state;
    const lang = state.lang;
    const favIds = state.favorites;
    const favWords = state.dictionary.filter(w => favIds.includes(w.id));

    const cardsHtml = favWords.length === 0
        ? `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;">
            <div style="font-size:4rem;margin-bottom:16px;">⭐</div>
            <p style="font-weight:800;font-size:1.2rem;color:var(--text-main);margin-bottom:8px;">${t('fav.title')}</p>
            <p style="color:var(--text-muted);">${t('fav.empty')}</p>
            <button onclick="window._navigate('dictionary')" class="btn btn-primary" style="margin-top:20px;">
                <i data-lucide="book-open" size="16"></i> Browse Dictionary
            </button>
           </div>`
        : favWords.map(word => {
            const d = word.translations?.[lang] || word.translations?.['en'] || {};
            const catColor = CAT_COLORS[word.category] || 'var(--primary)';
            return `
                <div class="mini-card" style="position:relative;gap:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                        <div>
                            <div style="font-weight:900;font-size:1.05rem;margin-bottom:4px;">${d.word || '—'}</div>
                            <span style="font-size:0.72rem;font-weight:700;color:${catColor};text-transform:capitalize;">${word.category}</span>
                        </div>
                        <button onclick="store.toggleFavorite('${word.id}')"
                            title="Remove from favorites"
                            style="border:none;background:#fef2f2;color:#ef4444;border-radius:50%;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;"
                            onmouseover="this.style.background='#ef4444';this.style.color='white'" onmouseout="this.style.background='#fef2f2';this.style.color='#ef4444'">
                            <i data-lucide="star-off" size="16"></i>
                        </button>
                    </div>
                    <p style="font-size:0.83rem;color:#475569;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${d.definition || ''}</p>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${Object.keys(word.translations || {}).map(lc => `
                            <span style="font-size:0.7rem;padding:3px 10px;border-radius:8px;background:#f1f5f9;color:#64748b;font-weight:700;">${lc === 'ar' ? 'ع' : lc === 'zgh' ? '⵿' : lc.toUpperCase()}: ${word.translations[lc]?.word || ''}</span>
                        `).join('')}
                    </div>
                    <button onclick="sessionStorage.setItem('chatbot_init_msg','Explain ${(d.word || '').replace(/'/g, "\\'") }');window._navigate('chatbot')"
                        class="btn" style="width:100%;background:#eff6ff;color:var(--primary);padding:10px;font-size:0.83rem;border-radius:12px;margin-top:4px;">
                        <i data-lucide="bot" size="14"></i> Ask AI about this
                    </button>
                </div>`;
        }).join('');

    const template = `
        <div style="animation:fadeIn 0.5s ease-out;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
                <div>
                    <h1 class="section-title" style="margin-bottom:4px;">
                        <i data-lucide="star" size="26" color="#f59e0b" fill="#f59e0b"></i>
                        ${t('fav.title')}
                    </h1>
                    <p style="color:var(--text-muted);font-size:0.9rem;">${favWords.length} term${favWords.length !== 1 ? 's' : ''} saved</p>
                </div>
                ${favWords.length > 0 ? `
                <button onclick="if(confirm('Clear all favorites?')){store.state.favorites.forEach(id=>store.toggleFavorite(id));window._rerender();}"
                    class="btn" style="background:#fef2f2;color:#ef4444;font-size:0.85rem;padding:10px 16px;border-radius:12px;">
                    <i data-lucide="trash-2" size="15"></i> Clear all
                </button>` : ''}
            </div>
            <div class="results-grid">${cardsHtml}</div>
        </div>`;

    return {
        template,
        init: () => { if (window.lucide) window.lucide.createIcons(); }
    };
}
