import { store } from '../store.js';

export function renderChatbot() {
    const t = (k) => store.t(k);

    const template = `
        <div style="max-width: 800px; margin: 0 auto; height: 80vh; display: flex; flex-direction: column; animation: fadeIn 0.5s ease-out;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 2rem;">${t('chatbot.title')} <i data-lucide="bot" color="var(--primary)"></i></h1>
            </div>

            <div class="glass-card" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative;">
                <!-- Chat History -->
                <div id="chat-history" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px;">
                    <!-- Welcome Message -->
                    <div class="chat-msg bot">
                        <div class="avatar"><i data-lucide="bot" size="20"></i></div>
                        <div class="bubble">${t('chatbot.welcome')}</div>
                    </div>
                </div>

                <!-- Input Area -->
                <div style="padding: 20px; border-top: 1px solid var(--glass-border); background: rgba(255,255,255,0.4);">
                    <form onsubmit="window.sendChat(event)" style="display: flex; gap: 10px;">
                        <input type="text" id="chat-input" placeholder="${t('chatbot.input_placeholder')}" autocomplete="off"
                            style="flex: 1; padding: 15px; border-radius: 25px; border: 1px solid var(--glass-border); outline: none;">
                        <button type="submit" class="btn btn-primary" style="border-radius: 50%; width: 50px; height: 50px; padding: 0; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="send"></i>
                        </button>
                    </form>
                </div>
            </div>

            <style>
                .chat-msg {
                    display: flex;
                    gap: 10px;
                    max-width: 80%;
                }
                .chat-msg.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }
                .chat-msg.bot {
                    align-self: flex-start;
                }
                .chat-msg .avatar {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    flex-shrink: 0;
                }
                .chat-msg.bot .avatar {
                    background: var(--primary);
                    color: white;
                }
                .chat-msg.user .avatar {
                    background: var(--secondary);
                    color: white;
                }
                .chat-msg .bubble {
                    background: white;
                    padding: 12px 18px;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    text-align: left;
                    position: relative;
                }
                .chat-msg.user .bubble {
                    background: var(--primary);
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                .chat-msg.bot .bubble {
                    border-top-left-radius: 4px;
                    background: rgba(255,255,255,0.9);
                    backdrop-filter: blur(5px);
                }
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    padding: 5px 0;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .dot:nth-child(1) { animation-delay: -0.32s; }
                .dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
                .suggested-questions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 15px;
                }
                .suggestion-chip {
                    padding: 8px 15px;
                    background: white;
                    border: 1px solid var(--glass-border);
                    border-radius: 20px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 600;
                    color: var(--primary);
                }
                .suggestion-chip:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-2px);
                }
            </style>

            <div class="suggested-questions">
                <div class="suggestion-chip" onclick="window.setChatInput('Explain Black Holes')">${t('chatbot.suggest.black_holes')}</div>
                <div class="suggestion-chip" onclick="window.setChatInput('Comment fonctionne l\\'ADN ?')">${t('chatbot.suggest.dna')}</div>
                <div class="suggestion-chip" onclick="window.setChatInput('تجربة كيميائية بسيطة')">${t('chatbot.suggest.experiment')}</div>
            </div>
        </div>
    `;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();

            window.setChatInput = (text) => {
                const input = document.getElementById('chat-input');
                if (input) {
                    input.value = text;
                    window.sendChat({ preventDefault: () => { } });
                }
            };

            const initMsg = sessionStorage.getItem('chatbot_init_msg');
            if (initMsg) {
                setTimeout(() => {
                    const input = document.getElementById('chat-input');
                    if (input) {
                        input.value = initMsg;
                        window.sendChat({ preventDefault: () => { } });
                    }
                }, 500);
                sessionStorage.removeItem('chatbot_init_msg');
            }
        }
    };
}

window.sendChat = async (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendMsg(msg, 'user');
    input.value = '';

    // Typing Indicator
    const tempId = 'typing-' + Date.now();
    const typingHtml = `
        <div class="typing-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    appendMsg(typingHtml, 'bot', tempId, true);

    try {
        const lang = store.state.lang;
        const lowerMsg = msg.toLowerCase();
        let context = "";

        const matchingTerms = store.state.dictionary.filter(item => {
            const data = item.translations[lang] || item.translations['en'];
            return lowerMsg.includes(data.word.toLowerCase());
        });

        if (matchingTerms.length > 0) {
            context = "Context from Scientific Dictionary:\n" +
                matchingTerms.map(t => {
                    const d = t.translations[lang] || t.translations['en'];
                    return `- ${d.word}: ${d.definition}`;
                }).join('\n') + "\n\nPlease use this information if relevant.";
        }

        const finalMsg = context ? `[${context}]\n\nUser Question: ${msg}` : msg;
        const reply = await store.apiChat(finalMsg);

        const typingMsg = document.getElementById(tempId);
        if (typingMsg) typingMsg.closest('.chat-msg').remove();

        appendMsg(reply, 'bot');
    } catch (err) {
        const typingMsg = document.getElementById(tempId);
        if (typingMsg) typingMsg.closest('.chat-msg').remove();
        appendMsg("I'm having trouble connecting to my scientific database. Please check if the backend is running.", 'bot');
    }
};

function appendMsg(text, sender, id = null, isHtml = false) {
    const container = document.getElementById('chat-history');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;

    const icon = sender === 'bot' ? 'bot' : 'user';

    let processedText = text;
    if (!isHtml) {
        processedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    div.innerHTML = `
        <div class="avatar"><i data-lucide="${icon}" size="20"></i></div>
        <div class="bubble" ${id ? `id="${id}"` : ''}>${processedText}</div>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
}
