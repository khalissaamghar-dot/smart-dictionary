import { store } from '../store.js';

export function renderGames() {
    const t = k => store.t(k);
    const state = store.state;
    const words = state.dictionary.filter(w => w.status === 'approved');

    let currentQuestion = null;
    let score = 0;
    let answered = false;

    const generateQuestion = () => {
        if (words.length < 4) return null;
        
        const correctWord = words[Math.floor(Math.random() * words.length)];
        const lang = state.lang;
        const d = correctWord.translations?.[lang] || correctWord.translations?.['en'] || {};
        
        // Pick 3 random distractors
        const distractors = [];
        while (distractors.length < 3) {
            const w = words[Math.floor(Math.random() * words.length)];
            if (w.id !== correctWord.id && !distractors.find(d => d.id === w.id)) {
                distractors.push(w);
            }
        }
        
        const options = [...distractors, correctWord].sort(() => Math.random() - 0.5);
        
        return {
            definition: d.definition,
            correctId: correctWord.id,
            options: options.map(o => ({
                id: o.id,
                word: (o.translations?.[lang] || o.translations?.['en'] || {}).word
            }))
        };
    };

    currentQuestion = generateQuestion();

    const template = `
        <div style="animation:fadeIn 0.5s ease-out; max-width:700px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h1 class="section-title" style="margin-bottom:0;">
                    <i data-lucide="gamepad-2" size="26" color="var(--primary)"></i>
                    Term Match Quiz
                </h1>
                <div style="background:var(--primary); color:white; padding:8px 20px; border-radius:30px; font-weight:800; font-size:0.9rem;">
                    Score: <span id="quiz-score">0</span>
                </div>
            </div>

            <div class="glass-card" style="padding:40px; border-radius:30px; position:relative; overflow:hidden;">
                <!-- Decorative element -->
                <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:rgba(59,130,246,0.05); border-radius:50%;"></div>
                
                <div id="quiz-container">
                    ${renderQuestionHtml(currentQuestion)}
                </div>
            </div>

            <div style="margin-top:30px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
                <p>Test your scientific knowledge across all languages!</p>
            </div>
        </div>
    `;

    function renderQuestionHtml(q) {
        if (!q) return `<p>Not enough words in the dictionary to play. Please add more terms!</p>`;
        
        const optionsHtml = q.options.map(opt => `
            <button class="quiz-option" onclick="window._handleQuizAnswer('${opt.id}', '${q.correctId}')"
                    style="width:100%; padding:18px 25px; border-radius:18px; border:2px solid #e2e8f0; background:white;
                    font-family:inherit; font-size:1.05rem; font-weight:700; text-align:left; cursor:pointer; transition:all 0.2s;
                    display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                ${opt.word}
                <i class="status-icon" data-lucide="circle" size="20" color="#cbd5e1"></i>
            </button>
        `).join('');

        return `
            <div style="margin-bottom:25px; font-size:0.8rem; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:1px;">
                Question: What term is defined as...
            </div>
            <div style="font-size:1.2rem; font-weight:600; color:var(--text-main); line-height:1.6; margin-bottom:35px; min-height:80px;">
                "${q.definition}"
            </div>
            <div id="options-list">
                ${optionsHtml}
            </div>
            <div id="quiz-feedback" style="margin-top:20px; height:24px; text-align:center; font-weight:700;"></div>
            <button id="next-btn" onclick="window._nextQuestion()" 
                    style="display:none; margin:30px auto 0; padding:12px 30px; border-radius:12px; background:var(--primary); color:white; border:none; font-weight:700; cursor:pointer; font-size:0.95rem;">
                Next Question <i data-lucide="arrow-right" size="18" style="vertical-align:middle; margin-left:8px;"></i>
            </button>
        `;
    }

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();

            window._handleQuizAnswer = (selectedId, correctId) => {
                if (answered) return;
                answered = true;
                
                const isCorrect = selectedId === correctId;
                if (isCorrect) score += 10;
                
                document.getElementById('quiz-score').textContent = score;
                
                const buttons = document.querySelectorAll('.quiz-option');
                buttons.forEach(btn => {
                    const btnId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                    btn.style.cursor = 'default';
                    
                    if (btnId === correctId) {
                        btn.style.borderColor = '#16a34a';
                        btn.style.background = '#f0fdf4';
                        btn.style.color = '#16a34a';
                        btn.querySelector('.status-icon').outerHTML = '<i data-lucide="check-circle" size="20" color="#16a34a"></i>';
                    } else if (btnId === selectedId && !isCorrect) {
                        btn.style.borderColor = '#ef4444';
                        btn.style.background = '#fef2f2';
                        btn.style.color = '#ef4444';
                        btn.querySelector('.status-icon').outerHTML = '<i data-lucide="x-circle" size="20" color="#ef4444"></i>';
                    }
                });

                const feedback = document.getElementById('quiz-feedback');
                feedback.textContent = isCorrect ? 'Correct! +10 points' : 'Not quite. Keep learning!';
                feedback.style.color = isCorrect ? '#16a34a' : '#ef4444';
                
                document.getElementById('next-btn').style.display = 'block';
                if (window.lucide) window.lucide.createIcons();
            };

            window._nextQuestion = () => {
                answered = false;
                currentQuestion = generateQuestion();
                document.getElementById('quiz-container').innerHTML = renderQuestionHtml(currentQuestion);
                if (window.lucide) window.lucide.createIcons();
            };
        }
    };
}
