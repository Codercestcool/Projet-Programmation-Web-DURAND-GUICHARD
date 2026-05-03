// Campus hotspots - interactive campus map overlay

document.addEventListener('DOMContentLoaded', () => {
    const campusSection = document.querySelector('.campus-hotspots');
    if (!campusSection) return;

    // Define hotspot positions (percentage-based, relative to image)
    const hotspots = [
        {
            x: 15,
            y: 25,
            title: 'Bâtiment Principal',
            icon: '🏢',
            description: 'Salles de cours et amphithéâtres'
        },
        {
            x: 50,
            y: 50,
            title: 'Labs Informatique',
            icon: '💻',
            description: 'Espaces de travail avec postes haute performance'
        },
        {
            x: 70,
            y: 35,
            title: 'Cafétéria',
            icon: '☕',
            description: 'Espace restauration et détente'
        },
        {
            x: 35,
            y: 75,
            title: 'Espaces collaboratifs',
            icon: '👥',
            description: 'Zones de travail en groupe et meeting rooms'
        },
        {
            x: 75,
            y: 70,
            title: 'Salle gym & loisirs',
            icon: '⚽',
            description: 'Espace pour clubs sportifs et activités'
        }
    ];

    // Create hotspot overlay
    const overlay = document.createElement('div');
    overlay.className = 'campus-overlay';
    overlay.setAttribute('role', 'presentation');

    hotspots.forEach((spot, idx) => {
        const hotspot = document.createElement('button');
        hotspot.className = 'campus-hotspot';
        hotspot.style.left = spot.x + '%';
        hotspot.style.top = spot.y + '%';
        hotspot.setAttribute('data-hotspot', idx);
        hotspot.setAttribute('title', spot.title);
        hotspot.setAttribute('aria-label', `${spot.title}: ${spot.description}`);
        hotspot.innerHTML = `<span class="hotspot-dot">${spot.icon}</span>`;

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'hotspot-tooltip';
        tooltip.innerHTML = `
            <h4>${spot.title}</h4>
            <p>${spot.description}</p>
        `;

        const wrapper = document.createElement('div');
        wrapper.className = 'hotspot-wrapper';
        wrapper.appendChild(hotspot);
        wrapper.appendChild(tooltip);

        hotspot.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle active state
            document.querySelectorAll('.hotspot-wrapper').forEach(w => {
                w.classList.remove('active');
            });
            wrapper.classList.add('active');
        });

        hotspot.addEventListener('mouseenter', () => {
            wrapper.classList.add('hover');
        });

        hotspot.addEventListener('mouseleave', () => {
            if (!wrapper.classList.contains('active')) {
                wrapper.classList.remove('hover');
            }
        });

        // Keyboard navigation
        hotspot.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                wrapper.classList.remove('active');
                hotspot.blur();
            }
        });

        overlay.appendChild(wrapper);
    });

    campusSection.appendChild(overlay);
});
