import { store } from '../store.js';

const CATEGORIES = ['physics', 'chemistry', 'biology', 'mathematics', 'astronomy', 'geology', 'computer_science', 'flora', 'fauna', 'plants'];

export function renderAddWord() {
    const t = k => store.t(k);

    const catOptions = CATEGORIES.map(c => `<option value="${c}">${t('cat.' + c)}</option>`).join('');

    const langTabs = [
        { code: 'en', label: '🇬🇧 English', dir: 'ltr' },
        { code: 'fr', label: '🇫🇷 Français', dir: 'ltr' },
        { code: 'ar', label: '🇲🇦 العربية', dir: 'rtl' },
        { code: 'zgh', label: 'ⵣ ⵜⵉⴼⵉⵏⴰⵖ', dir: 'ltr' },
    ];


    const template = `
        <div style="max-width:760px;margin:0 auto;animation:fadeIn 0.5s ease-out;">
            <div style="margin-bottom:28px;">
                <h1 class="section-title">
                    <i data-lucide="plus-circle" size="26" color="var(--primary)"></i>
                    ${t('add.title')}
                </h1>
                <p style="color:var(--text-muted);">${t('add.subtitle')}</p>
            </div>

            <div id="add-success" style="display:none;background:#f0fdf4;border:1.5px solid #bbf7d0;color:#16a34a;padding:16px 20px;border-radius:14px;margin-bottom:20px;font-weight:700;">
                ${t('add.success')}<br><small style="font-weight:400;opacity:0.8;">${t('add.pending_notice')}</small>
            </div>

            <form id="add-word-form" onsubmit="window._addWordSubmit(event)" style="display:flex;flex-direction:column;gap:22px;">

                <!-- Category -->
                <div class="glass-card" style="padding:22px;">
                    <label style="display:block;font-weight:800;font-size:0.85rem;margin-bottom:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">${t('add.category')}</label>
                    <select id="add-category" required
                        style="width:100%;padding:13px 16px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-size:0.95rem;outline:none;background:white;cursor:pointer;">
                        ${catOptions}
                    </select>
                </div>

                <!-- Language tabs -->
                ${langTabs.map((lang, i) => `
                <div class="glass-card" style="padding:22px;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
                        <span style="font-size:1.1rem;font-weight:800;">${lang.label}</span>
                        ${i === 0 ? '<span style="background:#dbeafe;color:var(--primary);font-size:0.7rem;padding:3px 8px;border-radius:6px;font-weight:700;">Required</span>' : '<span style="background:#f1f5f9;color:#94a3b8;font-size:0.7rem;padding:3px 8px;border-radius:6px;font-weight:700;">Optional</span>'}
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 2fr;gap:14px;" dir="${lang.dir}">
                        <div>
                            <label style="display:block;font-weight:700;font-size:0.82rem;margin-bottom:6px;color:var(--text-muted);">${t('add.word_' + lang.code)}</label>
                            <input type="text" id="add-word-${lang.code}" ${i === 0 ? 'required' : ''} placeholder="Term..."
                                style="width:100%;padding:12px 14px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-size:0.9rem;outline:none;transition:border-color 0.2s;"
                                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        <div>
                            <label style="display:block;font-weight:700;font-size:0.82rem;margin-bottom:6px;color:var(--text-muted);">${t('add.def_' + lang.code)}</label>
                            <textarea id="add-def-${lang.code}" ${i === 0 ? 'required' : ''} rows="3" placeholder="Definition..."
                                style="width:100%;padding:12px 14px;border-radius:10px;border:1.5px solid #e2e8f0;font-family:inherit;font-size:0.9rem;outline:none;resize:vertical;transition:border-color 0.2s;"
                                onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='#e2e8f0'"></textarea>
                        </div>
                    </div>
                </div>`).join('')}

                <!-- Image URL -->
                <div class="glass-card" style="padding:22px;">
                    <label style="display:block;font-weight:800;font-size:0.85rem;margin-bottom:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Illustration Image (URL)</label>
                    <div style="position:relative;">
                        <i data-lucide="image" size="18" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;"></i>
                        <input type="url" id="add-image-url" placeholder="https://images.unsplash.com/photo-..."
                            style="width:100%;padding:13px 16px 13px 44px;border-radius:12px;border:1.5px solid #e2e8f0;font-family:inherit;font-size:0.95rem;outline:none;background:white;">
                    </div>
                    <p style="font-size:0.75rem;color:#94a3b8;margin-top:8px;">Add a link to an image (Unsplash, Pexels, etc.) or a GIF to illustrate the term.</p>
                </div>

                <!-- Submit -->
                <button type="submit" id="add-submit-btn" class="btn btn-primary" style="padding:16px;font-size:1rem;border-radius:16px;">
                    <i data-lucide="send" size="18"></i> ${t('add.submit')}
                </button>
            </form>
        </div>`;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();
            window._addWordSubmit = async (e) => {
                e.preventDefault();
                const btn = document.getElementById('add-submit-btn');
                btn.disabled = true; btn.innerHTML = '<i data-lucide="loader" size="16"></i> Submitting...';
                if (window.lucide) window.lucide.createIcons();

                const buildLang = code => {
                    const word = document.getElementById(`add-word-${code}`)?.value?.trim();
                    const definition = document.getElementById(`add-def-${code}`)?.value?.trim();
                    return word ? { word, definition: definition || '' } : null;
                };
                const translations = {};
                ['en', 'fr', 'ar', 'zgh'].forEach(lc => {
                    const data = buildLang(lc);
                    if (data) translations[lc] = data;
                });

                try {
                    await store.addWord({
                        category: document.getElementById('add-category').value,
                        imageUrl: document.getElementById('add-image-url').value?.trim() || null,
                        translations,
                    });
                    document.getElementById('add-word-form').reset();
                    const successEl = document.getElementById('add-success');
                    successEl.style.display = 'block';
                    setTimeout(() => { successEl.style.display = 'none'; }, 5000);
                } catch (err) {
                    alert('Error: ' + err.message);
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = `<i data-lucide="send" size="18"></i> ${store.t('add.submit')}`;
                    if (window.lucide) window.lucide.createIcons();
                }
            };
        }
    };
}
