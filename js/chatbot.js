// ==================== CHATBOT EFREI ====================
// Simple chatbot with JSON-based responses, no API calls
// Works entirely in browser

document.addEventListener('DOMContentLoaded', function() {
    // Chatbot data - fallback if JSON fetch fails
    const chatbotData = {
        "formations": {
            "keywords": ["formation", "formations", "bachelor", "ingénieur", "cycle ingénieur", "spécialisation", "programme", "cursus", "diplôme"],
            "answer": "La page Formations présente le Bachelor Informatique, le cycle ingénieur et les spécialisations comme la cybersécurité, la data, l'IA et le développement web. Chaque programme offre des compétences pratiques et théoriques alignées avec l'industrie."
        },
        "equipe": {
            "keywords": ["équipe", "enseignant", "prof", "professeur", "intervenant", "responsable", "personnel", "staff"],
            "answer": "La page Équipe présente les enseignants, intervenants et responsables pédagogiques du département informatique. Nous avons des experts en développement web, cybersécurité, data science, et bien d'autres domaines."
        },
        "vie_etudiante": {
            "keywords": ["vie étudiante", "club", "clubs", "association", "associations", "campus", "projet étudiant", "événement", "activité", "vie campus"],
            "answer": "La page Vie étudiante présente le campus, les plus de 60 associations et clubs, les événements et les projets étudiants. Vous y découvrirez les clubs tech, sportifs, culturels, entrepreneurship et bien plus !"
        },
        "contact": {
            "keywords": ["contact", "adresse", "email", "mail", "téléphone", "villejuif", "lieu", "coordonnées", "nous contacter"],
            "answer": "Vous pouvez contacter EFREI à l'adresse 30-32 avenue de la République, 94800 Villejuif. Téléphone: +33 1 88 28 90 01. Email: admissions@efrei.fr. Vous pouvez aussi remplir le formulaire de contact sur la page Contact."
        },
        "quiz": {
            "keywords": ["quiz", "question", "jeu", "javascript", "test", "orientation", "parcours"],
            "answer": "La page Quiz propose une activité interactive en JavaScript pour découvrir quel parcours informatique vous correspond le mieux. Testez vos préférences et trouvez votre formation idéale !"
        },
        "accueil": {
            "keywords": ["accueil", "bienvenue", "accueil", "présentation", "page d'accueil", "home"],
            "answer": "Bienvenue sur le site d'EFREI ! Découvrez nos formations, notre équipe, la vie étudiante et bien plus. N'hésitez pas à explorer les différentes pages du site."
        },
        "default": {
            "answer": "Je n'ai pas bien compris votre question. Vous pouvez me demander des informations sur : Formations, Équipe, Vie étudiante, Contact, Quiz, ou Accueil. Essayez !"
        }
    };

    // Initialize chatbot
    initChatbot(chatbotData);
});

function initChatbot(chatbotData) {
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickButtons = document.querySelectorAll('.chatbot-quick-btn');

    if (!chatbotBubble) return; // Chatbot not present on this page

    // Toggle chatbot
    chatbotBubble.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Send message on form submit
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (message) {
            sendMessage(message, chatbotData, chatbotMessages, chatbotInput);
        }
    });

    // Quick buttons
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            sendMessage(question, chatbotData, chatbotMessages, chatbotInput);
        });
    });
}

function sendMessage(message, chatbotData, messagesContainer, inputField) {
    // Add user message
    addMessage(message, 'user', messagesContainer);
    
    // Clear input
    inputField.value = '';
    
    // Get bot response
    const response = getBotResponse(message, chatbotData);
    
    // Add bot message with slight delay
    setTimeout(() => {
        addMessage(response, 'bot', messagesContainer);
    }, 300);
}

function addMessage(text, sender, container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function getBotResponse(userInput, chatbotData) {
    // Normalize input
    const input = userInput.toLowerCase().trim();
    
    // Check each category
    for (const [key, data] of Object.entries(chatbotData)) {
        if (key === 'default') continue;
        
        // Check if any keyword matches
        const keywords = data.keywords || [];
        for (const keyword of keywords) {
            if (input.includes(keyword)) {
                return data.answer;
            }
        }
    }
    
    // Default response if no match
    return chatbotData.default.answer;
}
