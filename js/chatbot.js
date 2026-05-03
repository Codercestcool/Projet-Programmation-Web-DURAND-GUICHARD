// Chatbot v2 - JSON-driven, scoring, localStorage, accessible

document.addEventListener('DOMContentLoaded', async () => {
    const defaultData = await loadChatbotData();
    initChatbot(defaultData);
});

async function loadChatbotData() {
    const fallback = {};
    try {
        const resp = await fetch('../data/chatbot.json', {cache: 'no-store'});
        if (!resp.ok) throw new Error('Network response not ok');
        const data = await resp.json();
        return data;
    } catch (e) {
        try {
            const local = await fetch('./data/chatbot.json');
            if (local.ok) return await local.json();
        } catch (e2) {
            // ignore
        }
        return fallback;
    }
}

function initChatbot(data) {
    const bubble = document.getElementById('chatbot-bubble');
    const container = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesEl = document.getElementById('chatbot-messages');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const quickArea = document.querySelector('.chatbot-quick-buttons');

    if (!bubble || !container || !messagesEl || !form || !input) return;

    // Add aria-labels if not present
    if (!messagesEl.getAttribute('aria-live')) {
        messagesEl.setAttribute('aria-live', 'polite');
        messagesEl.setAttribute('aria-label', 'Messages du chatbot');
    }
    if (!input.getAttribute('aria-label')) {
        input.setAttribute('aria-label', 'Posez votre question à l\'assistant EFREI');
    }

    // Render top-level quick replies (from JSON quick_replies)
    renderTopQuickReplies(data, quickArea);

    // Restore history
    const history = loadHistory();
    if (history && history.length) {
        history.forEach(item => renderMessage(item, messagesEl));
        messagesEl.scrollTop = messagesEl.scrollHeight;
    } else if (data.meta && data.meta.welcome) {
        delayedBotMessage(data.meta.welcome, data, messagesEl);
    }

    // Add clear button to header
    const header = container.querySelector('.chatbot-header');
    if (header && !document.getElementById('chatbot-clear')) {
        const clear = document.createElement('button');
        clear.id = 'chatbot-clear';
        clear.type = 'button';
        clear.textContent = 'Effacer';
        clear.style.marginRight = '8px';
        clear.addEventListener('click', () => {
            if (confirm('Effacer la conversation ?')) {
                clearHistory();
                messagesEl.innerHTML = '';
            }
        });
        header.insertBefore(clear, header.firstChild);
    }

    // Toggle
    bubble.addEventListener('click', () => {
        container.classList.toggle('active');
        if (container.classList.contains('active')) input.focus();
    });

    closeBtn && closeBtn.addEventListener('click', () => container.classList.remove('active'));

    // Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') container.classList.remove('active');
    });

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        handleUserMessage(text, data, messagesEl, input);
    });

    // Quick replies dynamic handler (delegation)
    quickArea && quickArea.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-question]');
        if (!btn) return;
        const q = btn.getAttribute('data-question');
        if (!q) return;
        handleUserMessage(q, data, messagesEl, input);
    });
}

function renderTopQuickReplies(data, area) {
    if (!area) return;
    area.innerHTML = '';
    const top = data.quick_replies || [];
    top.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chatbot-quick-btn';
        btn.setAttribute('data-question', item.question || item.label || '');
        btn.setAttribute('aria-label', `Poser la question: ${item.label || item.question || ''}`);
        btn.textContent = (item.icon ? item.icon + ' ' : '') + (item.label || item.question || '');
        area.appendChild(btn);
    });
}

function handleUserMessage(text, data, messagesEl, inputEl) {
    const user = {sender: 'user', text: text, ts: Date.now()};
    appendAndSave(user, messagesEl);
    inputEl.value = '';

    const best = findBestMatch(text, data);

    if (!best) {
        // fallback
        const fallbacks = data.fallbacks || (data.default && data.default.suggestions) || [];
        delayedBotMessage((data.default && data.default.answer) || (fallbacks[0] || 'Désolé, je n’ai pas compris.'), data, messagesEl);
        return;
    }

    // Build bot content
    let botText = best.answer || '';
    delayedBotMessage(botText, data, messagesEl, best);
}

function findBestMatch(input, data) {
    if (!input) return null;
    const clean = normalizeText(input);
    const tokens = clean.split(/\s+/).filter(Boolean);
    const keys = Object.keys(data).filter(k => !['meta','quick_replies','fallbacks','default'].includes(k));
    let best = null;
    let bestScore = 0;

    for (const key of keys) {
        const entry = data[key];
        const keywords = (entry && entry.keywords) || [];
        let score = 0;
        for (const kw of keywords) {
            const k = normalizeText(kw);
            if (!k) continue;
            // exact phrase
            if (clean.includes(k)) {
                const weight = Math.max(1, k.split(/\s+/).length);
                score += 2 * weight;
            } else {
                // partial token matches
                const kwTokens = k.split(/\s+/).filter(Boolean);
                for (const t of kwTokens) {
                    if (tokens.includes(t)) score += 1;
                }
            }
        }
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }

    // require minimal score
    if (bestScore <= 0) return null;
    return best;
}

function normalizeText(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function delayedBotMessage(text, data, messagesEl, entry) {
    showTypingIndicator(messagesEl);
    setTimeout(() => {
        removeTypingIndicator(messagesEl);
        const bot = {sender: 'bot', text: text, ts: Date.now()};
        appendAndSave(bot, messagesEl, entry);
        // after message, if entry has suggestions or route/cta, render them
        if (entry) {
            if (entry.suggestions && entry.suggestions.length) renderSuggestionButtons(entry.suggestions, messagesEl);
            if (entry.route || entry.cta) renderRouteButton(entry, messagesEl);
        } else if (data && data.default && data.default.suggestions) {
            renderSuggestionButtons(data.default.suggestions, messagesEl);
        }
    }, 400);
}

function showTypingIndicator(container) {
    const el = document.createElement('div');
    el.className = 'chatbot-message bot-message typing';
    el.setAttribute('aria-live', 'polite');
    el.textContent = 'Assistant écrit...';
    el.dataset.typing = '1';
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator(container) {
    const el = container.querySelector('[data-typing="1"]');
    if (el) el.remove();
}

function renderSuggestionButtons(suggestions, container) {
    if (!suggestions || !suggestions.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'chatbot-suggestions';
    suggestions.slice(0,5).forEach(s => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chatbot-suggestion-btn';
        b.setAttribute('data-question', s);
        b.textContent = s;
        b.addEventListener('click', () => {
            const input = document.getElementById('chatbot-input');
            handleUserMessage(s, window._efrei_chatbot_data || {}, document.getElementById('chatbot-messages'), input);
        });
        wrap.appendChild(b);
    });
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
}

function renderRouteButton(entry, container) {
    const div = document.createElement('div');
    div.className = 'chatbot-route';
    if (entry.route || entry.cta) {
        const a = document.createElement('a');
        a.href = entry.route || '#';
        a.rel = 'noopener noreferrer';
        a.textContent = entry.cta || 'Voir';
        a.className = 'chatbot-cta';
        div.appendChild(a);
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

function appendAndSave(item, container, entryMeta) {
    renderMessage(item, container, entryMeta);
    saveToHistory(item);
    container.scrollTop = container.scrollHeight;
}

function renderMessage(item, container, entryMeta) {
    const div = document.createElement('div');
    div.className = 'chatbot-message ' + (item.sender === 'user' ? 'user-message' : 'bot-message');
    div.setAttribute('data-ts', item.ts || Date.now());
    const textNode = document.createTextNode(item.text || '');
    div.appendChild(textNode);
    container.appendChild(div);
}

// LocalStorage history helpers
const HISTORY_KEY = 'efrei_chat_history_v2';
function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
}

function saveToHistory(item) {
    try {
        const cur = loadHistory();
        cur.push(item);
        // limit size
        if (cur.length > 200) cur.splice(0, cur.length - 200);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(cur));
    } catch (e) { /* ignore */ }
}

function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
}

// Expose helper for suggestions to access data
window._efrei_chatbot_data = window._efrei_chatbot_data || {};

