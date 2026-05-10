// Filtrage des formations par catégorie

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.formation-card');
    if (!cards.length) return;

    // Lister les catégories présentes dans les cartes
    const categories = new Set();
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat) categories.add(cat);
    });

    // Créer les boutons de filtre dans la zone prévue
    const filterContainer = document.querySelector('.formations-filters');
    if (!filterContainer) return;

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.setAttribute('data-filter', 'all');
    allBtn.setAttribute('aria-label', 'Afficher toutes les formations');
    allBtn.textContent = 'Tous';
    filterContainer.appendChild(allBtn);

    const categoryLabels = {
        'bachelor': 'Bachelor Informatique',
        'cycle': 'Cycle Ingénieur',
        'specialisation': 'Spécialisations'
    };

    Array.from(categories).sort().forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', cat);
        btn.setAttribute('aria-label', `Afficher les formations ${categoryLabels[cat] || cat}`);
        btn.textContent = categoryLabels[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
        filterContainer.appendChild(btn);
    });

    // Gérer les clics sur les filtres
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Réinitialiser l'état actif de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Afficher uniquement les cartes correspondant au filtre
            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = '';
                    card.setAttribute('aria-hidden', 'false');
                } else {
                    const cardCat = card.getAttribute('data-category');
                    if (cardCat === filter) {
                        card.style.display = '';
                        card.setAttribute('aria-hidden', 'false');
                    } else {
                        card.style.display = 'none';
                        card.setAttribute('aria-hidden', 'true');
                    }
                }
            });
        });
    });
});
