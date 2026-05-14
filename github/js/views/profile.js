import { store } from '../store.js';

export function renderProfile() {
    const t = k => store.t(k);
    const user = store.state.user;

    if (!user) return '<div class="glass-card">Please login to view your profile.</div>';

    const initials = (user.name?.[0] || 'U') + (user.lastName?.[0] || '');
    const userRole = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User';

    const template = `
        <div style="animation:fadeIn 0.5s ease-out; max-width:800px; margin:0 auto;">
            <h1 class="section-title">
                <i data-lucide="user" size="26" color="var(--primary)"></i>
                ${t('nav.profile')}
            </h1>

            <div class="glass-card" style="padding:40px; display:flex; flex-direction:column; align-items:center; text-align:center;">
                <div style="width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--secondary));
                    display:flex; align-items:center; justify-content:center; color:white; font-weight:900; font-size:2.5rem; margin-bottom:20px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    ${initials.toUpperCase()}
                </div>
                
                <h2 style="font-size:1.8rem; font-weight:900; margin-bottom:8px;">${user.name} ${user.lastName || ''}</h2>
                <div style="background:rgba(59,130,246,0.1); color:var(--primary); padding:6px 16px; border-radius:20px; font-weight:700; font-size:0.85rem; margin-bottom:24px;">
                    ${userRole}
                </div>

                <div style="width:100%; display:grid; grid-template-columns:1fr 1fr; gap:20px; text-align:left; margin-top:10px;">
                    <div style="padding:15px; background:white; border-radius:15px; border:1px solid rgba(0,0,0,0.05);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:4px;">Email</div>
                        <div style="font-weight:600; font-size:0.95rem;">${user.email}</div>
                    </div>
                    <div style="padding:15px; background:white; border-radius:15px; border:1px solid rgba(0,0,0,0.05);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:4px;">Institution</div>
                        <div style="font-weight:600; font-size:0.95rem;">${user.institution || 'N/A'}</div>
                    </div>
                    <div style="padding:15px; background:white; border-radius:15px; border:1px solid rgba(0,0,0,0.05);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:4px;">Member Since</div>
                        <div style="font-weight:600; font-size:0.95rem;">${new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <div style="padding:15px; background:white; border-radius:15px; border:1px solid rgba(0,0,0,0.05);">
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-bottom:4px;">Status</div>
                        <div style="font-weight:600; font-size:0.95rem; color:#16a34a;">${user.status === 'approved' ? 'Active' : 'Pending'}</div>
                    </div>
                </div>

                <button onclick="store.logout()" class="btn" style="margin-top:40px; background:rgba(239,68,68,0.1); color:#ef4444; width:200px;">
                    <i data-lucide="log-out" size="18"></i> ${t('nav.logout')}
                </button>
            </div>
        </div>
    `;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();
        }
    };
}
