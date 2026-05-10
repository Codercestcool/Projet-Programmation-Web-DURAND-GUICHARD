document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadChatbotData();
  initChatbot(data);
});

let chatbotScrollY = 0;

async function loadChatbotData() {
  try {
    let response = await fetch("../data/chatbot.json", { cache: "no-store" });

    if (!response.ok) {
      response = await fetch("./data/chatbot.json", { cache: "no-store" });
    }

    if (!response.ok) {
      throw new Error("Impossible de charger chatbot.json");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur chatbot.json :", error);

    return {
      meta: {
        welcome:
          "Bonjour ! Je peux t'aider à explorer les formations, les admissions, le campus, les débouchés ou le quiz."
      },
      default: {
        answer:
          "Je n'ai pas bien compris. Essaie avec : formations, Bachelor, cycle ingénieur, débouchés, admissions, campus, quiz ou contact.",
        suggestions: [
          "Parlez-moi des formations",
          "Comment candidater ?",
          "Quels sont les débouchés ?",
          "Où se trouve le campus ?",
          "Faire le quiz"
        ]
      }
    };
  }
}

function initChatbot(data) {
  window._efrei_chatbot_data = data || {};

  const bubble = document.getElementById("chatbot-bubble");
  const container = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("chatbot-close");
  const messagesEl = document.getElementById("chatbot-messages");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");

  if (!bubble || !container || !messagesEl || !form || !input) {
    console.warn("Chatbot : un élément HTML est manquant.");
    return;
  }

  removeOldQuickButtons();

  const history = loadHistory();

  if (history.length > 0) {
    history.forEach((msg) => renderMessage(msg, messagesEl));
    messagesEl.scrollTop = messagesEl.scrollHeight;
  } else {
    const welcome =
      data.meta?.welcome ||
      "Bonjour ! Je peux t'aider à explorer les formations, les admissions, le campus, les débouchés ou le quiz.";

    delayedBotMessage(welcome, data, messagesEl, {
      suggestions: [
        "Parlez-moi des formations",
        "Comment candidater ?",
        "Quels sont les débouchés ?",
        "Où se trouve le campus ?",
        "Faire le quiz"
      ]
    });
  }

  addClearButton(container, messagesEl, data);

  bubble.addEventListener("click", () => {
    container.classList.toggle("active");

    if (container.classList.contains("active")) {
      removeOldQuickButtons();
      lockPageScroll();
      input.focus({ preventScroll: true });
    } else {
      unlockPageScroll();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      container.classList.remove("active");
      unlockPageScroll();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      container.classList.remove("active");
      unlockPageScroll();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    handleUserMessage(text, data, messagesEl, input);
  });
}

function removeOldQuickButtons() {
  const quickAreas = document.querySelectorAll(
    ".chatbot-quick-buttons, .quick-buttons, .quick-replies"
  );

  quickAreas.forEach((area) => {
    area.remove();
  });
}

function handleUserMessage(text, data, messagesEl, inputEl) {
  window._efrei_last_question = text;
  removeOldQuickButtons();

  const userMessage = {
    sender: "user",
    text,
    ts: Date.now()
  };

  appendAndSave(userMessage, messagesEl);

  if (inputEl) {
    inputEl.value = "";
  }

  const match = findBestMatch(text, data);

  if (!match) {
    const fallbackText =
      data.default?.answer ||
      "Je n'ai pas bien compris. Essaie avec : formations, admissions, campus, débouchés ou quiz.";

    delayedBotMessage(fallbackText, data, messagesEl, data.default || null);
    return;
  }

  delayedBotMessage(match.answer, data, messagesEl, match);
}

function findBestMatch(input, data) {
  if (!input || !data) return null;

  const cleanInput = normalizeText(input);
  const inputTokens = cleanInput.split(" ").filter(Boolean);

  const ignoredKeys = ["meta", "quick_replies", "fallbacks", "default"];
  const keys = Object.keys(data).filter((key) => !ignoredKeys.includes(key));

  let bestEntry = null;
  let bestScore = 0;

  keys.forEach((key) => {
    const entry = data[key];

    if (!entry || !Array.isArray(entry.keywords)) return;

    let score = 0;

    entry.keywords.forEach((keyword) => {
      const cleanKeyword = normalizeText(keyword);
      if (!cleanKeyword) return;

      const keywordTokens = cleanKeyword.split(" ").filter(Boolean);

      if (cleanInput.includes(cleanKeyword)) {
        score += keywordTokens.length * 6;
      }

      keywordTokens.forEach((token) => {
        if (token.length > 2 && inputTokens.includes(token)) {
          score += 1;
        }
      });
    });

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  });

  return bestScore > 0 ? bestEntry : null;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function delayedBotMessage(text, data, messagesEl, entry) {
  showTypingIndicator(messagesEl);

  setTimeout(() => {
    removeTypingIndicator(messagesEl);

    const botMessage = {
      sender: "bot",
      text,
      ts: Date.now()
    };

    appendAndSave(botMessage, messagesEl);

    if (entry) {
      if (entry.suggestions && entry.suggestions.length > 0) {
        renderSuggestionButtons(entry.suggestions, messagesEl, window._efrei_last_question || "");
      }

      if (entry.route && entry.cta) {
        renderRouteButton(entry, messagesEl);
      }
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, 350);
}

function renderMessage(item, container) {
  const message = document.createElement("div");

  message.className =
    "chatbot-message " +
    (item.sender === "user" ? "user-message" : "bot-message");

  message.textContent = item.text || "";

  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

function appendAndSave(item, container) {
  renderMessage(item, container);
  saveToHistory(item);
}

function renderSuggestionButtons(suggestions, container, currentQuestion = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "chatbot-suggestions";

  const cleanCurrentQuestion = normalizeText(currentQuestion);

  const filteredSuggestions = suggestions
    .filter((suggestion) => {
      const cleanSuggestion = normalizeText(suggestion);

      // Éviter d'afficher une suggestion déjà identique à la question en cours
      return cleanSuggestion !== cleanCurrentQuestion;
    })
    .slice(0, 5);

  if (filteredSuggestions.length === 0) {
    return;
  }

  filteredSuggestions.forEach((suggestion) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "chatbot-suggestion-btn";
    button.textContent = suggestion;
    button.setAttribute("data-question", suggestion);

    button.addEventListener("click", () => {
      const input = document.getElementById("chatbot-input");
      const messages = document.getElementById("chatbot-messages");
      const data = window._efrei_chatbot_data || {};

      if (!messages) return;

      document.querySelectorAll(".chatbot-suggestions").forEach((el) => {
        el.remove();
      });

      handleUserMessage(suggestion, data, messages, input);
    });

    wrapper.appendChild(button);
  });

  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function renderRouteButton(entry, container) {
  if (!entry.route || !entry.cta) return;

  const wrapper = document.createElement("div");
  wrapper.className = "chatbot-route";

  const link = document.createElement("a");
  link.className = "chatbot-cta";
  link.href = entry.route;
  link.textContent = entry.cta;

  wrapper.appendChild(link);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(container) {
  const typing = document.createElement("div");

  typing.className = "chatbot-message bot-message typing";
  typing.dataset.typing = "true";
  typing.textContent = "Assistant écrit...";

  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator(container) {
  const typing = container.querySelector("[data-typing='true']");
  if (typing) typing.remove();
}

function addClearButton(container, messagesEl, data) {
  const header = container.querySelector(".chatbot-header");

  if (!header || document.getElementById("chatbot-clear")) return;

  const clearButton = document.createElement("button");

  clearButton.id = "chatbot-clear";
  clearButton.className = "chatbot-clear-btn";
  clearButton.type = "button";
  clearButton.textContent = "Effacer";

  clearButton.addEventListener("click", () => {
    clearHistory();
    messagesEl.innerHTML = "";
    removeOldQuickButtons();

    const welcome =
      data.meta?.welcome ||
      "Conversation effacée. Pose-moi une question sur l’EFREI.";

    delayedBotMessage(welcome, data, messagesEl, {
      suggestions: [
        "Parlez-moi des formations",
        "Comment candidater ?",
        "Quels sont les débouchés ?",
        "Où se trouve le campus ?",
        "Faire le quiz"
      ]
    });
  });

  header.insertBefore(clearButton, header.firstChild);
}

function lockPageScroll() {
  const body = document.body;

  if (body.classList.contains("chatbot-open")) return;

  chatbotScrollY = window.scrollY || window.pageYOffset || 0;

  body.classList.add("chatbot-open");
  body.style.position = "fixed";
  body.style.top = `-${chatbotScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
}

function unlockPageScroll() {
  const body = document.body;

  if (!body.classList.contains("chatbot-open")) return;

  body.classList.remove("chatbot-open");
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";

  window.scrollTo(0, chatbotScrollY);
}

const HISTORY_KEY = "efrei_chat_history_v2";

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveToHistory(item) {
  try {
    const history = loadHistory();

    history.push(item);

    if (history.length > 120) {
      history.splice(0, history.length - 120);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn("Impossible de sauvegarder l’historique du chatbot.");
  }
}

function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn("Impossible d’effacer l’historique du chatbot.");
  }
}