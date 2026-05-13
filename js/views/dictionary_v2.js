import { store } from '../store.js';

const CATEGORIES = ['all', 'physics', 'chemistry', 'biology', 'mathematics', 'astronomy', 'geology', 'computer_science', 'flora', 'fauna', 'plants'];
const CAT_ICONS = { 
    physics: '⚛️', 
    chemistry: '⚗️', 
    biology: '🧬', 
    mathematics: '📐', 
    astronomy: '🔭', 
    geology: '🌍', 
    computer_science: '💻',
    flora: '🌸',
    fauna: '🦁',
    plants: '🌿',
    all: '📚' 
};
const CAT_COLORS = { 
    physics: '#3b82f6', 
    chemistry: '#10b981', 
    biology: '#8b5cf6', 
    mathematics: '#f59e0b', 
    astronomy: '#6366f1', 
    geology: '#78716c', 
    computer_science: '#0ea5e9',
    flora: '#ec4899',
    fauna: '#f97316',
    plants: '#22c55e',
    all: 'var(--primary)' 
};

let _filter = 'all';
let _search = '';
let _selectedWord = null;

// Helper to get HTML for a single word card - Passing state and lang explicitly
function getWordCardHtml(word, state, t) {
    const lang = state.lang;
    const d = word.translations?.[lang] || word.translations?.['en'] || {};
    const isFav = store.isFavorite(word.id);
    const isPending = word.status === 'pending';
    const catColor = CAT_COLORS[word.category] || 'var(--primary)';
    let imgHtml = '';
    if (word.imageUrl) {
        if (word.imageUrl.toLowerCase().endsWith('.mp4')) {
            imgHtml = `<video src="${word.imageUrl}" autoplay muted loop playsinline 
                         style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></video>`;
        } else {
            imgHtml = `<img src="${word.imageUrl}" 
                         onerror="this.onerror=null; this.outerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#94a3b8;font-size:0.85rem;text-align:center;padding:10px;box-sizing:border-box;font-style:italic;\\'>L\\'image sera affichée très prochainement</div>';"
                         alt="${d.word}" 
                         onclick="event.stopPropagation(); window._expandImage(this.src, '${(d.word || '').replace(/'/g, "\\\\'")}')"
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; cursor: zoom-in;" 
                         onmouseover="this.style.transform='scale(1.1)'" 
                         onmouseout="this.style.transform='scale(1)'">`;
        }
    } else {
        imgHtml = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#94a3b8;font-size:0.85rem;text-align:center;padding:10px;box-sizing:border-box;font-style:italic;">L'image sera affichée très prochainement</div>`;
    }

    return `
        <div class="mini-card" onclick="window._dictSelect('${word.id}')" style="position:relative; padding-top: 0; overflow: hidden; animation: fadeIn 0.3s ease-out;">
            <div style="width: 100%; height: 120px; overflow: hidden; margin-bottom: 12px; margin-left: -20px; margin-right: -20px; width: calc(100% + 40px); background: #f8fafc;">
                ${imgHtml}
            </div>
            <div style="padding: 0 0 15px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <span style="font-size:1.4rem;">${CAT_ICONS[word.category] || '🔬'}</span>
                    <div style="display:flex;align-items:center;gap:6px;">
                        ${isPending ? `<span style="font-size:0.65rem;background:#fef3c7;color:#d97706;padding:3px 8px;border-radius:6px;font-weight:700;">${t('dict.pending')}</span>` : ''}
                        <button onclick="event.stopPropagation();window._speak('${(d.word || '').replace(/'/g, "\\'")}', '${lang}')"
                            style="border:none;background:#f8fafc;cursor:pointer;padding:6px;border-radius:8px;color:#64748b;transition:all 0.2s;" title="Prononcer">
                            <i data-lucide="volume-2" size="16"></i>
                        </button>
                        <button onclick="event.stopPropagation();store.toggleFavorite('${word.id}')"
                            style="border:none;background:none;cursor:pointer;padding:4px;color:${isFav ? '#f59e0b' : '#cbd5e1'};transition:color 0.2s;">
                            <i data-lucide="star" size="18" fill="${isFav ? '#f59e0b' : 'none'}" stroke="${isFav ? '#f59e0b' : '#cbd5e1'}"></i>
                        </button>
                    </div>
                </div>
                <div style="font-weight:900;font-size:1.05rem;color:var(--text-main);margin-bottom:4px;">${d.word || '—'}</div>
                <div style="font-size:0.75rem;text-transform:capitalize;font-weight:700;color:${catColor};margin-bottom:10px;">${word.category}</div>
                <div style="font-size:0.82rem;color:#475569;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${d.definition || ''}</div>
            </div>
        </div>`;
}

export function renderDictionary() {
    const t = k => store.t(k);
    const state = store.state;
    const lang = state.lang;

    const catPills = CATEGORIES.map(c => {
        const count = c === 'all' ? state.dictionary.length : state.dictionary.filter(w => w.category === c && (w.status === 'approved' || w.author === state.user?.email)).length;
        if (c !== 'all' && count === 0) return '';
        return `<button class="cat-pill ${_filter === c ? 'active' : ''}" onclick="window._dictFilter('${c}')" data-cat="${c}">
            ${CAT_ICONS[c]} ${t('cat.' + c)} <span style="opacity:0.7;font-size:0.75rem;">(${count})</span>
        </button>`;
    }).join('');

    const getFilteredWords = () => {
        return state.dictionary.filter(w => {
            const matchCat = _filter === 'all' || w.category === _filter;
            const d = w.translations?.[lang] || w.translations?.['en'] || {};
            const matchSearch = !_search || d.word?.toLowerCase().includes(_search.toLowerCase()) || d.definition?.toLowerCase().includes(_search.toLowerCase());
            return matchCat && matchSearch;
        });
    };

    const generateGridHtml = (words) => {
        if (words.length === 0) {
            return `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">
                <div style="font-size:3rem;margin-bottom:15px;">🔍</div>
                <p style="font-weight:700;font-size:1.1rem;">${t('dict.no_results')}</p>
               </div>`;
        }
        return words.map(w => getWordCardHtml(w, state, t)).join('');
    };

    const wordsHtml = generateGridHtml(getFilteredWords());

    const modalHtml = _selectedWord ? (() => {
        const w = state.dictionary.find(x => x.id === _selectedWord);
        if (!w) return '';
        const d = w.translations?.[lang] || w.translations?.['en'] || {};
        const isFav = store.isFavorite(w.id);
        const transRows = Object.entries(w.translations || {}).map(([lc, ld]) => `
            <tr>
                <td style="padding:10px 14px;font-weight:700;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;width:60px;">${lc === 'zgh' ? '⵿TFG' : lc.toUpperCase()}</td>
                <td style="padding:10px 14px;font-weight:800;color:var(--primary); display: flex; align-items: center; gap: 8px;">
                    ${ld.word}
                    <button onclick="window._speak('${(ld.word || '').replace(/'/g, "\\'")}', '${lc}')"
                        style="border:none;background:#f1f5f9;cursor:pointer;padding:4px;border-radius:6px;color:var(--primary);display:flex;align-items:center;justify-content:center;">
                        <i data-lucide="volume-2" size="14"></i>
                    </button>
                </td>
                <td style="padding:10px 14px;font-size:0.85rem;color:#475569;line-height:1.5;">${ld.definition}</td>
            </tr>`).join('');

        return `
            <div id="dict-modal" onclick="if(event.target===this)window._dictSelect(null)"
                style="position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(4px);z-index:100;
                display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease-out;">
                <div style="background:white;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,0.2);width:100%;max-width:720px;max-height:85vh;overflow-y:auto;">
                    <div style="display:flex; flex-direction: column;">
                        <div style="width: 100%; height: 250px; overflow: hidden; background: #f8fafc;">
                             ${w.imageUrl ? (w.imageUrl.toLowerCase().endsWith('.mp4') ? 
                                `<video src="${w.imageUrl}" autoplay muted loop playsinline controls
                                    style="width: 100%; height: 100%; object-fit: cover;"></video>` :
                                `<img src="${w.imageUrl}" 
                                    onerror="this.onerror=null; this.outerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#94a3b8;font-size:1.1rem;text-align:center;padding:20px;box-sizing:border-box;font-style:italic;\\'>L\\'image sera affichée très prochainement</div>';"
                                    alt="${d.word}" 
                                    onclick="window._expandImage(this.src, '${(d.word || '').replace(/'/g, "\\\\'")}')"
                                    style="width: 100%; height: 100%; object-fit: cover; cursor: zoom-in;">`) : 
                                `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f8fafc;color:#94a3b8;font-size:1.1rem;text-align:center;padding:20px;box-sizing:border-box;font-style:italic;">L'image sera affichée très prochainement</div>`}
                        </div>
                        <div style="padding: 30px 30px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <div style="font-size: 1rem; margin-bottom: 6px;">${CAT_ICONS[w.category] || '🔬'} <span style="text-transform: capitalize; color: ${CAT_COLORS[w.category]}; font-weight: 700;">${w.category}</span></div>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <h2 style="font-size: 1.8rem; font-weight: 900; margin: 0;">${d.word}</h2>
                                    <button onclick="window._speak('${(d.word || '').replace(/'/g, "\\'")}', '${lang}')"
                                        style="border:none;background:var(--primary-glow);cursor:pointer;padding:8px;border-radius:12px;color:var(--primary);transition:all 0.2s;" title="Prononcer">
                                        <i data-lucide="volume-2" size="22"></i>
                                    </button>
                                </div>
                                <p style="color: #475569; margin-top: 8px; line-height: 1.6; font-size: 0.95rem;">${d.definition}</p>
                            </div>
                            <div style="display: flex; gap: 8px; flex-shrink: 0; margin-left: 20px;">
                                <button onclick="store.toggleFavorite('${w.id}')" class="btn" style="background: ${isFav ? '#fffbeb' : '#f8fafc'}; color: ${isFav ? '#f59e0b' : 'var(--text-muted)'}; padding: 10px 16px; font-size: 0.85rem;">
                                    <i data-lucide="star" size="16" fill="${isFav ? '#f59e0b' : 'none'}"></i>
                                </button>
                                ${w.url ? `<a href="${w.url}" target="_blank" class="btn" style="background: #f0fdf4; color: #16a34a; text-decoration: none; padding: 10px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;"><i data-lucide="external-link" size="16"></i></a>` : ''}
                                <button onclick="window._dictSelect(null)" style="border: none; background: #f1f5f9; border-radius: 50%; width: 38px; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                    <i data-lucide="x" size="18"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style="padding: 24px 30px;">
                        <h3 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 16px;">${t('dict.translations')}</h3>
                        <table style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid #f1f5f9;">
                            ${transRows}
                        </table>
                    </div>
                </div>
            </div>`;
    })() : '';

    const template = `
        <div id="dictionary-view">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:15px;">
                <h1 class="section-title" style="margin-bottom:0;">
                    <i data-lucide="book-open" size="26" color="var(--primary)"></i>
                    ${t('dict.title')}
                </h1>
                <div style="position:relative;flex:1;max-width:380px;">
                    <i data-lucide="search" size="18" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none;"></i>
                    <input type="text" id="dict-search-input" placeholder="${t('dict.search')}" value="${_search}"
                        oninput="window._dictSearch(this.value)"
                        style="width:100%;padding:13px 16px 13px 44px;border-radius:25px;border:1.5px solid #e2e8f0;font-family:inherit;font-size:0.9rem;outline:none;background:white;transition:all 0.2s;">
                </div>
            </div>
            <div id="dict-categories" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:25px;">
                ${catPills}
            </div>
            <div id="dict-results-grid" class="results-grid">${wordsHtml}</div>
        </div>
        ${modalHtml}`;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();

            window._dictFilter = (cat) => {
                _filter = cat;
                window._rerender();
            };

            window._dictSearch = (q) => {
                _search = q;
                const filteredNow = getFilteredWords();
                const grid = document.getElementById('dict-results-grid');
                if (grid) {
                    grid.innerHTML = generateGridHtml(filteredNow);
                    if (window.lucide) window.lucide.createIcons();
                }
            };

            window._dictSelect = (id) => {
                _selectedWord = id;
                window._rerender();
            };

            window._speak = (text, langCode) => {
                if (!window.speechSynthesis) return;
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                const langMap = { en: 'en-US', fr: 'fr-FR', ar: 'ar-SA' };
                utterance.lang = langMap[langCode] || 'en-US';
                utterance.rate = 0.85;
                window.speechSynthesis.speak(utterance);
            };

            window._expandImage = (src, caption) => {
                const lb = document.getElementById('lightbox-overlay');
                const img = document.getElementById('lightbox-image');
                const video = document.getElementById('lightbox-video');
                const cap = document.getElementById('lightbox-caption');

                if (lb && img && video && cap) {
                    img.style.display = 'none';
                    video.style.display = 'none';
                    video.pause();
                    video.src = '';

                    if (src.toLowerCase().endsWith('.mp4')) {
                        video.src = src;
                        video.style.display = 'block';
                    } else {
                        img.src = src;
                        img.style.display = 'block';
                    }

                    cap.textContent = caption;
                    lb.style.display = 'flex';
                    if (window.lucide) window.lucide.createIcons();
                }
            };

            window._closeLightbox = () => {
                const lb = document.getElementById('lightbox-overlay');
                const video = document.getElementById('lightbox-video');
                if (lb) lb.style.display = 'none';
                if (video) {
                    video.pause();
                    video.src = '';
                }
            };
        }
    };
}
