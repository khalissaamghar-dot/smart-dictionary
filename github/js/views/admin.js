import { store } from '../store.js';

export function renderAdmin() {
    const t = k => store.t(k);
    const state = store.state;
    
    // We'll fetch pending data in init
    let pendingWords = [];
    let pendingTeachers = [];

    const template = `
        <div style="animation:fadeIn 0.5s ease-out;">
            <h1 class="section-title">
                <i data-lucide="shield-check" size="26" color="var(--primary)"></i>
                Admin Dashboard
            </h1>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
                <!-- Pending Words -->
                <div class="glass-card" style="padding:25px;">
                    <h3 style="margin-bottom:20px; font-weight:800; display:flex; justify-content:space-between;">
                        <span>Pending Word Approvals</span>
                        <span id="word-count" style="background:var(--primary); color:white; padding:2px 10px; border-radius:10px; font-size:0.75rem;">0</span>
                    </h3>
                    <div id="pending-words-list" style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto;">
                        <p style="color:var(--text-muted); font-size:0.9rem;">Loading pending words...</p>
                    </div>
                </div>

                <!-- Teacher Approvals -->
                <div class="glass-card" style="padding:25px;">
                    <h3 style="margin-bottom:20px; font-weight:800; display:flex; justify-content:space-between;">
                        <span>Pending Teacher Access</span>
                        <span id="teacher-count" style="background:#8b5cf6; color:white; padding:2px 10px; border-radius:10px; font-size:0.75rem;">0</span>
                    </h3>
                    <div id="pending-teachers-list" style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto;">
                        <p style="color:var(--text-muted); font-size:0.9rem;">Loading pending teachers...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    function renderPendingWords(words) {
        if (words.length === 0) return '<p style="color:var(--text-muted); font-size:0.9rem;">No pending words.</p>';
        return words.map(w => {
            const d = w.translations?.en || {};
            return `
                <div style="padding:15px; background:white; border-radius:12px; border:1px solid #e2e8f0;">
                    <div style="font-weight:700; margin-bottom:5px;">${d.word}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">By: ${w.author}</div>
                    <div style="display:flex; gap:8px;">
                        <button onclick="window._approveWord('${w.id}')" class="btn" style="padding:6px 12px; font-size:0.75rem; background:#16a34a; color:white; border:none;">Approve</button>
                        <button onclick="window._rejectWord('${w.id}')" class="btn" style="padding:6px 12px; font-size:0.75rem; background:rgba(239,68,68,0.1); color:#ef4444; border:none;">Reject</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderPendingTeachers(teachers) {
        if (teachers.length === 0) return '<p style="color:var(--text-muted); font-size:0.9rem;">No pending teachers.</p>';
        return teachers.map(u => `
            <div style="padding:15px; background:white; border-radius:12px; border:1px solid #e2e8f0;">
                <div style="font-weight:700; margin-bottom:5px;">${u.name} ${u.lastName || ''}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${u.email} - ${u.institution}</div>
                <div style="display:flex; gap:8px;">
                    <button onclick="window._approveTeacher('${u.id}', 'approved')" class="btn" style="padding:6px 12px; font-size:0.75rem; background:#8b5cf6; color:white; border:none;">Verify</button>
                    <button onclick="window._approveTeacher('${u.id}', 'rejected')" class="btn" style="padding:6px 12px; font-size:0.75rem; background:rgba(239,68,68,0.1); color:#ef4444; border:none;">Deny</button>
                </div>
            </div>
        `).join('');
    }

    return {
        template,
        init: async () => {
            if (window.lucide) window.lucide.createIcons();

            const loadData = async () => {
                pendingWords = await store.getPendingWords();
                pendingTeachers = await store.getPendingTeachers();
                
                document.getElementById('pending-words-list').innerHTML = renderPendingWords(pendingWords);
                document.getElementById('pending-teachers-list').innerHTML = renderPendingTeachers(pendingTeachers);
                document.getElementById('word-count').textContent = pendingWords.length;
                document.getElementById('teacher-count').textContent = pendingTeachers.length;
            };

            window._approveWord = async (id) => {
                await store.approveWord(id);
                loadData();
            };

            window._rejectWord = async (id) => {
                await store.rejectWord(id);
                loadData();
            };

            window._approveTeacher = async (id, action) => {
                await store.approveTeacher(id, action);
                loadData();
            };

            loadData();
        }
    };
}
