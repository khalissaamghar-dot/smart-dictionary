import { store } from '../store.js';

export function renderAuth() {
    const t = k => store.t(k);

    const template = `
        <div class="auth-page-container">
            <!-- Background Decorations -->
            <div class="auth-decor-blob blob-1"></div>
            <div class="auth-decor-blob blob-2"></div>
            
            <div class="auth-glass-card">
                <!-- Left Panel: Branding & Mission -->
                <div class="auth-brand-panel">
                    <div class="auth-brand-content">
                        <div class="auth-logo-wrapper">
                            <i data-lucide="microscope" class="auth-logo-icon"></i>
                        </div>
                        <h1 class="auth-brand-title">
                            <span class="brand-text-en">SMART</span>
                            <span class="brand-text-ar">قاموسي</span>
                        </h1>
                        <p class="auth-brand-description">
                            ${t('auth.description')}
                        </p>
                        
                        <div class="auth-feature-list">
                            <div class="auth-feature-item">
                                <i data-lucide="languages" size="18"></i>
                                <span>4 Languages (EN, FR, AR, ZGH)</span>
                            </div>
                            <div class="auth-feature-item">
                                <i data-lucide="brain-circuit" size="18"></i>
                                <span>AI-Powered Scientific Assistant</span>
                            </div>
                            <div class="auth-feature-item">
                                <i data-lucide="award" size="18"></i>
                                <span>Curated Scientific Knowledge</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="auth-brand-footer">
                        <div class="auth-lang-pills">
                            <span class="lang-pill">English</span>
                            <span class="lang-pill">Français</span>
                            <span class="lang-pill">العربية</span>
                            <span class="lang-pill">ⵜⵉⴼⵉⵏⴰⵖ</span>
                        </div>
                    </div>
                </div>

                <!-- Right Panel: Forms -->
                <div class="auth-form-panel">
                    <div class="auth-form-header">
                        <div class="auth-tabs">
                            <button id="auth-tab-login" class="auth-tab active" onclick="window._authTab('login')">
                                ${t('auth.login')}
                            </button>
                            <button id="auth-tab-register" class="auth-tab" onclick="window._authTab('register')">
                                ${t('auth.register')}
                            </button>
                        </div>
                    </div>

                    <div class="auth-form-body">
                        <!-- Login Form -->
                        <div id="auth-form-login" class="auth-view-container active">
                            <div class="auth-header-text">
                                <h2>${t('auth.welcome_back')}</h2>
                                <p>${t('auth.login')} to access your workspace</p>
                            </div>

                            <div id="auth-error-login" class="auth-error-msg"></div>

                            <form id="login-form" onsubmit="window._loginSubmit(event)" class="auth-form">
                                <div class="form-group">
                                    <label>${t('auth.email')}</label>
                                    <div class="input-wrapper">
                                        <i data-lucide="mail" class="input-icon"></i>
                                        <input type="email" id="login-email" required placeholder="you@example.com">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="label-row">
                                        <label>${t('auth.password')}</label>
                                        <a href="#" class="forgot-link">Forgot?</a>
                                    </div>
                                    <div class="input-wrapper">
                                        <i data-lucide="lock" class="input-icon"></i>
                                        <input type="password" id="login-password" required placeholder="••••••••">
                                    </div>
                                </div>
                                <button type="submit" class="auth-submit-btn">
                                    <span>${t('auth.submit_login')}</span>
                                    <i data-lucide="arrow-right" size="18"></i>
                                </button>
                            </form>

                            <div class="auth-social-sep">
                                <span>Quick Access</span>
                            </div>

                            <div class="demo-access-card" onclick="window._fillDemo()">
                                <div class="demo-icon"><i data-lucide="key" size="16"></i></div>
                                <div class="demo-info">
                                    <span class="demo-label">Demo Administrator</span>
                                    <span class="demo-creds">admin@demo.com / admin123</span>
                                </div>
                            </div>
                        </div>

                        <!-- Register Form -->
                        <div id="auth-form-register" class="auth-view-container">
                            <div class="auth-header-text">
                                <h2>${t('auth.create_account')}</h2>
                                <p>Join our scientific network today</p>
                            </div>

                            <div id="auth-error-register" class="auth-error-msg"></div>

                            <form id="register-form" onsubmit="window._registerSubmit(event)" class="auth-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>${t('auth.name')}</label>
                                        <input type="text" id="reg-name" required placeholder="Jane">
                                    </div>
                                    <div class="form-group">
                                        <label>${t('auth.lastName')}</label>
                                        <input type="text" id="reg-lastname" required placeholder="Doe">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>${t('auth.email')}</label>
                                    <div class="input-wrapper">
                                        <i data-lucide="mail" class="input-icon"></i>
                                        <input type="email" id="reg-email" required placeholder="you@example.com">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>${t('auth.password')}</label>
                                    <div class="input-wrapper">
                                        <i data-lucide="lock" class="input-icon"></i>
                                        <input type="password" id="reg-password" required placeholder="Min. 6 characters">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>${t('auth.institution')}</label>
                                        <input type="text" id="reg-institution" placeholder="Univ/School">
                                    </div>
                                    <div class="form-group">
                                        <label>${t('auth.role')}</label>
                                        <select id="reg-role">
                                            <option value="student">${t('auth.student')}</option>
                                            <option value="teacher">${t('auth.teacher')}</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" class="auth-submit-btn register">
                                    <span>${t('auth.submit_register')}</span>
                                    <i data-lucide="user-plus" size="18"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .auth-page-container {
                position: fixed;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f8fafc;
                overflow: hidden;
                font-family: 'Outfit', sans-serif;
            }

            .auth-decor-blob {
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                z-index: 0;
                opacity: 0.4;
            }

            .blob-1 {
                width: 500px;
                height: 500px;
                background: var(--primary);
                top: -100px;
                right: -100px;
                animation: pulse-blob 10s infinite alternate;
            }

            .blob-2 {
                width: 400px;
                height: 400px;
                background: var(--secondary);
                bottom: -100px;
                left: -100px;
                animation: pulse-blob 8s infinite alternate-reverse;
            }

            @keyframes pulse-blob {
                0% { transform: scale(1) translate(0, 0); opacity: 0.3; }
                100% { transform: scale(1.2) translate(20px, 30px); opacity: 0.5; }
            }

            .auth-glass-card {
                position: relative;
                z-index: 10;
                width: 1000px;
                height: 650px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 32px;
                display: flex;
                overflow: hidden;
                box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15);
            }

            /* Left Panel */
            .auth-brand-panel {
                flex: 1.1;
                background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #0d9488 100%);
                padding: 60px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: white;
                position: relative;
                overflow: hidden;
            }

            .auth-brand-panel::before {
                content: '';
                position: absolute;
                inset: 0;
                background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 4.878L59.947 10.2l-5.32 5.32-5.32-5.32 5.32-5.32zM4.733 4.878L10.053 10.2l-5.32 5.32-5.32-5.32 5.32-5.32zM34.898 35.043l5.32 5.32-5.32 5.32-5.32-5.32 5.32-5.32zm-20 0l5.32 5.32-5.32 5.32-5.32-5.32 5.32-5.32z' fill='white' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
                opacity: 0.3;
            }

            .auth-logo-wrapper {
                width: 64px;
                height: 64px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            }

            .auth-logo-icon { color: white; width: 32px; height: 32px; }

            .auth-brand-title {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-bottom: 24px;
            }

            .brand-text-en {
                font-size: 0.9rem;
                letter-spacing: 6px;
                font-weight: 400;
                opacity: 0.8;
            }

            .brand-text-ar {
                font-size: 3.5rem;
                font-family: 'Cairo', sans-serif;
                font-weight: 900;
                line-height: 1;
            }

            .auth-brand-description {
                font-size: 1.1rem;
                line-height: 1.6;
                opacity: 0.9;
                max-width: 400px;
                margin-bottom: 40px;
            }

            .auth-feature-list {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .auth-feature-item {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 0.95rem;
                font-weight: 500;
                background: rgba(255, 255, 255, 0.1);
                padding: 10px 16px;
                border-radius: 12px;
                width: fit-content;
            }

            .auth-lang-pills {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .lang-pill {
                font-size: 0.75rem;
                padding: 4px 12px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 20px;
                font-weight: 600;
            }

            /* Right Panel */
            .auth-form-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 50px 60px;
            }

            .auth-tabs {
                display: flex;
                background: #f1f5f9;
                padding: 4px;
                border-radius: 14px;
                margin-bottom: 40px;
            }

            .auth-tab {
                flex: 1;
                padding: 10px;
                border: none;
                background: transparent;
                font-weight: 700;
                font-size: 0.9rem;
                color: #64748b;
                cursor: pointer;
                border-radius: 10px;
                transition: all 0.3s;
            }

            .auth-tab.active {
                background: white;
                color: var(--primary);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }

            .auth-view-container {
                display: none;
                animation: slideUp 0.4s ease-out;
            }

            .auth-view-container.active { display: block; }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .auth-header-text h2 {
                font-size: 1.8rem;
                font-weight: 900;
                color: #0f172a;
                margin-bottom: 8px;
            }

            .auth-header-text p {
                color: #64748b;
                font-size: 1rem;
                margin-bottom: 32px;
            }

            .auth-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .label-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            label {
                font-weight: 700;
                font-size: 0.85rem;
                color: #475569;
            }

            .forgot-link {
                font-size: 0.8rem;
                color: var(--primary);
                font-weight: 600;
                text-decoration: none;
            }

            .input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .input-icon {
                position: absolute;
                left: 16px;
                color: #94a3b8;
                width: 18px;
                height: 18px;
            }

            .input-wrapper input, .form-group input, .form-group select {
                width: 100%;
                padding: 14px 16px;
                border-radius: 12px;
                border: 2px solid #e2e8f0;
                font-family: inherit;
                font-size: 0.95rem;
                transition: all 0.2s;
                outline: none;
            }

            .input-wrapper input { padding-left: 48px; }

            .input-wrapper input:focus, .form-group input:focus, .form-group select:focus {
                border-color: var(--primary);
                background: #fcfdfe;
                box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
            }

            .auth-submit-btn {
                margin-top: 10px;
                padding: 16px;
                border-radius: 14px;
                border: none;
                background: var(--primary);
                color: white;
                font-weight: 800;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                transition: all 0.3s;
                box-shadow: 0 10px 25px rgba(30, 64, 175, 0.25);
            }

            .auth-submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 30px rgba(30, 64, 175, 0.35);
                filter: brightness(1.1);
            }

            .auth-submit-btn.register {
                background: var(--secondary);
                box-shadow: 0 10px 25px rgba(13, 148, 136, 0.25);
            }

            .auth-submit-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .auth-social-sep {
                margin: 32px 0 24px;
                position: relative;
                text-align: center;
            }

            .auth-social-sep::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                width: 100%;
                height: 1px;
                background: #e2e8f0;
                z-index: 1;
            }

            .auth-social-sep span {
                position: relative;
                z-index: 2;
                background: white;
                padding: 0 16px;
                color: #94a3b8;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .demo-access-card {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                border: 2px dashed #cbd5e1;
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.2s;
                background: #f8fafc;
            }

            .demo-access-card:hover {
                border-color: var(--primary);
                background: #eff6ff;
            }

            .demo-icon {
                width: 36px;
                height: 36px;
                background: white;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }

            .demo-info {
                display: flex;
                flex-direction: column;
            }

            .demo-label {
                font-weight: 800;
                font-size: 0.85rem;
                color: #1e293b;
            }

            .demo-creds {
                font-size: 0.8rem;
                color: #64748b;
                font-family: monospace;
            }

            .auth-error-msg {
                display: none;
                background: #fef2f2;
                color: #ef4444;
                padding: 14px 18px;
                border-radius: 12px;
                margin-bottom: 24px;
                font-size: 0.9rem;
                font-weight: 600;
                border-left: 4px solid #ef4444;
            }

            @media (max-width: 1050px) {
                .auth-glass-card { width: 95%; height: auto; flex-direction: column; }
                .auth-brand-panel { padding: 40px; }
                .auth-brand-description { display: none; }
                .auth-form-panel { padding: 40px; }
            }
        </style>
    `;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();

            window._authTab = (tab) => {
                const isLogin = tab === 'login';
                document.getElementById('auth-form-login').classList.toggle('active', isLogin);
                document.getElementById('auth-form-register').classList.toggle('active', !isLogin);
                
                document.getElementById('auth-tab-login').classList.toggle('active', isLogin);
                document.getElementById('auth-tab-register').classList.toggle('active', !isLogin);
            };

            window._fillDemo = () => {
                const emailInput = document.getElementById('login-email');
                const passInput = document.getElementById('login-password');
                if (emailInput && passInput) {
                    emailInput.value = 'admin@demo.com';
                    passInput.value = 'admin123';
                    // Optional: trigger login
                }
            };

            window._loginSubmit = async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const errEl = document.getElementById('auth-error-login');
                const btn = e.target.querySelector('button[type=submit]');
                
                btn.disabled = true;
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<span>Processing...</span>';
                errEl.style.display = 'none';

                try {
                    await store.apiLogin(email, password);
                    window._navigate('dashboard');
                } catch (err) {
                    errEl.style.display = 'block';
                    errEl.textContent = err.message || 'Authentication failed. Please check your credentials.';
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                }
            };

            window._registerSubmit = async (e) => {
                e.preventDefault();
                const errEl = document.getElementById('auth-error-register');
                const btn = e.target.querySelector('button[type=submit]');
                
                btn.disabled = true;
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<span>Creating Account...</span>';
                errEl.style.display = 'none';

                try {
                    const userData = {
                        email: document.getElementById('reg-email').value,
                        password: document.getElementById('reg-password').value,
                        name: document.getElementById('reg-name').value,
                        lastName: document.getElementById('reg-lastname').value,
                        institution: document.getElementById('reg-institution').value,
                        role: document.getElementById('reg-role').value,
                    };
                    const result = await store.apiRegister(userData);
                    if (result.status === 'approved') {
                        await store.apiLogin(userData.email, userData.password);
                        window._navigate('dashboard');
                    } else {
                        alert('Registration successful! Your teacher account is pending administrator approval.');
                        window._authTab('login');
                    }
                } catch (err) {
                    errEl.style.display = 'block';
                    errEl.textContent = err.message || 'Registration failed. Please try again.';
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                }
            };
        }
    };
}
