import { store } from '../store.js';

export function renderSettings() {
    const t = k => store.t(k);
    const state = store.state;

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇲🇦' },
        { code: 'zgh', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: 'ⵣ' },
    ];

    const langOptions = languages.map(l => `
        <div class="glass-card lang-card ${state.lang === l.code ? 'active' : ''}" 
             onclick="window._setLang('${l.code}')"
             style="cursor:pointer; padding:20px; display:flex; align-items:center; gap:15px; transition:all 0.3s;
             border: 2px solid ${state.lang === l.code ? 'var(--primary)' : 'transparent'};">
            <div style="font-size:1.8rem;">${l.flag}</div>
            <div style="flex:1;">
                <div style="font-weight:700; font-size:1rem;">${l.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${l.code.toUpperCase()}</div>
            </div>
            ${state.lang === l.code ? '<i data-lucide="check-circle-2" size="20" color="var(--primary)"></i>' : ''}
        </div>
    `).join('');

    const template = `
        <div style="animation:fadeIn 0.5s ease-out; max-width:800px; margin:0 auto;">
            <h1 class="section-title">
                <i data-lucide="settings" size="26" color="var(--primary)"></i>
                ${t('nav.settings')}
            </h1>

            <section style="margin-bottom:40px;">
                <h3 style="font-size:1.1rem; margin-bottom:20px; font-weight:800;">${t('settings.language')}</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:15px;">
                    ${langOptions}
                </div>
            </section>

            <section style="margin-bottom:40px;">
                <h3 style="font-size:1.1rem; margin-bottom:20px; font-weight:800;">${t('settings.appearance')}</h3>
                <div class="glass-card" style="padding:25px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:700;">${t('settings.dark_mode')}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);">Switch between light and dark themes (Experimental)</div>
                    </div>
                    <div style="width:50px; height:26px; background:#e2e8f0; border-radius:15px; position:relative; cursor:not-allowed; opacity:0.6;">
                        <div style="width:20px; height:20px; background:white; border-radius:50%; position:absolute; top:3px; left:3px; box-shadow:0 2px 5px rgba(0,0,0,0.1);"></div>
                    </div>
                </div>
            </section>

            <section>
                <h3 style="font-size:1.1rem; margin-bottom:20px; font-weight:800;">${t('settings.notifications')}</h3>
                <div class="glass-card" style="padding:25px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:700;">Push Notifications</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);">Get notified about new terms and updates</div>
                    </div>
                    <div style="width:50px; height:26px; background:#cbd5e1; border-radius:15px; position:relative; cursor:not-allowed; opacity:0.6;">
                        <div style="width:20px; height:20px; background:white; border-radius:50%; position:absolute; top:3px; left:3px;"></div>
                    </div>
                </div>
            </section>
        </div>

        <style>
            .lang-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
            .lang-card.active { background: rgba(59, 130, 246, 0.05); }
        </style>
    `;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();
        }
    };
}
