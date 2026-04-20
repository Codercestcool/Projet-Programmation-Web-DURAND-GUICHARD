document.addEventListener('DOMContentLoaded', function () {
    const questions = [
        {
            question: 'Quel type de projet vous attire le plus ?',
            help: 'Une seule réponse, celle qui vous parle le plus.',
            options: [
                { label: 'Créer un site ou une appli web', scores: { bachelor: 2, ingenieur: 0, specialisation: 0 } },
                { label: 'Concevoir une solution complexe et robuste', scores: { bachelor: 0, ingenieur: 2, specialisation: 0 } },
                { label: 'Travailler sur la cybersécurité ou les données', scores: { bachelor: 0, ingenieur: 0, specialisation: 2 } }
            ]
        },
        {
            question: 'Quand vous apprenez, vous préférez...',
            help: 'Choisissez votre manière d’avancer sur un sujet.',
            options: [
                { label: 'Découvrir les bases étape par étape', scores: { bachelor: 2, ingenieur: 0, specialisation: 0 } },
                { label: 'Approfondir et comprendre le fonctionnement global', scores: { bachelor: 0, ingenieur: 2, specialisation: 0 } },
                { label: 'Choisir un domaine précis pour aller très loin', scores: { bachelor: 0, ingenieur: 0, specialisation: 2 } }
            ]
        },
        {
            question: 'Quel sujet vous motive le plus ?',
            help: 'Chaque option correspond à une orientation différente.',
            options: [
                { label: 'Développement web', scores: { bachelor: 2, ingenieur: 0, specialisation: 0 } },
                { label: 'Architecture logicielle et systèmes', scores: { bachelor: 0, ingenieur: 2, specialisation: 0 } },
                { label: 'IA, cloud ou cybersécurité', scores: { bachelor: 0, ingenieur: 0, specialisation: 2 } }
            ]
        },
        {
            question: 'Dans un projet de groupe, vous êtes plutôt...',
            help: 'Répondez selon votre posture naturelle.',
            options: [
                { label: 'Celui qui met en place les premières briques', scores: { bachelor: 2, ingenieur: 0, specialisation: 0 } },
                { label: 'Celui qui organise et fait tenir la structure', scores: { bachelor: 0, ingenieur: 2, specialisation: 0 } },
                { label: 'Celui qui apporte une expertise précise', scores: { bachelor: 0, ingenieur: 0, specialisation: 2 } }
            ]
        },
        {
            question: 'Votre objectif principal après la formation ?',
            help: 'Le dernier choix aide à départager les profils proches.',
            options: [
                { label: 'Entrer rapidement dans le monde pro', scores: { bachelor: 2, ingenieur: 0, specialisation: 0 } },
                { label: 'Viser un poste à forte responsabilité technique', scores: { bachelor: 0, ingenieur: 2, specialisation: 0 } },
                { label: 'Devenir expert dans un domaine ciblé', scores: { bachelor: 0, ingenieur: 0, specialisation: 2 } }
            ]
        }
    ];

    const paths = {
        bachelor: {
            title: 'Bachelor Informatique',
            text: 'Votre profil correspond à une formation qui vous permet de construire des bases solides et de progresser progressivement vers le développement et les systèmes.',
            points: [
                'Vous aimez apprendre de façon concrète.',
                'Vous cherchez une montée en compétence progressive.',
                'Vous êtes à l’aise avec les fondamentaux du web et de la programmation.'
            ]
        },
        ingenieur: {
            title: 'Cycle Ingénieur',
            text: 'Vous avez un profil orienté conception, approfondissement et vision globale. Le cycle ingénieur vous permet de viser des postes techniques exigeants.',
            points: [
                'Vous aimez comprendre le “pourquoi” derrière les solutions.',
                'Vous êtes attiré par les systèmes complexes.',
                'Vous pouvez viser des postes à responsabilité technique.'
            ]
        },
        specialisation: {
            title: 'Spécialisation',
            text: 'Votre réponse montre un intérêt fort pour un domaine précis comme la cybersécurité, la data ou l’IA. Une spécialisation vous permettrait d’aller plus loin.',
            points: [
                'Vous aimez approfondir un sujet précis.',
                'Vous êtes motivé par l’expertise.',
                'Vous pouvez viser des métiers plus ciblés et techniques.'
            ]
        }
    };

    const questionElement = document.getElementById('quiz-question');
    const helpElement = document.getElementById('quiz-help');
    const optionsElement = document.getElementById('quiz-options');
    const nextButton = document.getElementById('quiz-next');
    const restartButton = document.getElementById('quiz-restart');
    const againButton = document.getElementById('quiz-again');
    const resultElement = document.getElementById('quiz-result');
    const cardElement = document.getElementById('quiz-card');
    const counterElement = document.getElementById('quiz-counter');
    const progressBar = document.getElementById('quiz-progress-bar');
    const resultTitle = document.getElementById('quiz-result-title');
    const resultText = document.getElementById('quiz-result-text');
    const resultPoints = document.getElementById('quiz-result-points');

    let currentQuestionIndex = 0;
    let selectedOptionIndex = null;
    let scores = { bachelor: 0, ingenieur: 0, specialisation: 0 };

    function renderQuestion() {
        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;
        helpElement.textContent = question.help;
        counterElement.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
        optionsElement.innerHTML = '';
        selectedOptionIndex = null;
        nextButton.disabled = true;

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'quiz-option';
            button.textContent = option.label;
            button.addEventListener('click', function () {
                selectedOptionIndex = index;
                nextButton.disabled = false;
                document.querySelectorAll('.quiz-option').forEach((item) => item.classList.remove('selected'));
                button.classList.add('selected');
            });
            optionsElement.appendChild(button);
        });
    }

    function applySelection() {
        if (selectedOptionIndex === null) {
            return;
        }

        const selectedOption = questions[currentQuestionIndex].options[selectedOptionIndex];
        Object.keys(scores).forEach((key) => {
            scores[key] += selectedOption.scores[key] || 0;
        });
    }

    function showResult() {
        const finalKey = Object.keys(scores).reduce((bestKey, currentKey) => (
            scores[currentKey] > scores[bestKey] ? currentKey : bestKey
        ));
        const result = paths[finalKey];

        progressBar.style.width = '100%';
        cardElement.hidden = true;
        resultElement.hidden = false;
        resultTitle.textContent = result.title;
        resultText.textContent = result.text;
        resultPoints.innerHTML = '';
        result.points.forEach((point) => {
            const item = document.createElement('li');
            item.textContent = point;
            resultPoints.appendChild(item);
        });
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        selectedOptionIndex = null;
        scores = { bachelor: 0, ingenieur: 0, specialisation: 0 };
        resultElement.hidden = true;
        cardElement.hidden = false;
        renderQuestion();
    }

    nextButton.addEventListener('click', function () {
        applySelection();
        currentQuestionIndex += 1;

        if (currentQuestionIndex >= questions.length) {
            showResult();
            return;
        }

        renderQuestion();
    });

    restartButton.addEventListener('click', restartQuiz);
    againButton.addEventListener('click', restartQuiz);

    renderQuestion();
});