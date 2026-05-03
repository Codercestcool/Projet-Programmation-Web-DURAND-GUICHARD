document.addEventListener('DOMContentLoaded', function () {
    try {
        const container = document.getElementById('agenda-cards');
        const filters = document.getElementById('agenda-filters');
        if (!container) return;

        const fallback = [
            { title: 'Journée portes ouvertes', date: '2026-05-20', type: 'JPO', location: 'Campus Villejuif', description: 'Présentation des formations et rencontres.' , link: 'contact.html' },
            { title: 'Atelier IA', date: '2026-06-10', type: 'Atelier', location: 'Lab IA', description: 'Atelier pratique Python/ML.' , link: 'formations.html' }
        ];

        function loadEvents(data) {
            data.sort((a,b) => new Date(a.date) - new Date(b.date));
            renderEvents(data);
            renderFilters(data);
        }

        function renderFilters(data) {
            if (!filters) return;
            const types = Array.from(new Set(data.map(e => e.type)));
            filters.innerHTML = '';
            const allBtn = document.createElement('button');
            allBtn.className = 'filter-btn active';
            allBtn.textContent = 'Tous';
            allBtn.dataset.filter = 'all';
            filters.appendChild(allBtn);
            types.forEach(t => {
                const b = document.createElement('button');
                b.className = 'filter-btn';
                b.textContent = t;
                b.dataset.filter = t;
                filters.appendChild(b);
            });

            filters.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') return;
                const f = e.target.dataset.filter;
                filters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                applyFilter(f);
            });
        }

        function applyFilter(filter) {
            const cards = container.querySelectorAll('.event-card');
            cards.forEach(c => {
                if (!filter || filter === 'all') { 
                    c.style.removeProperty('display');
                    return; 
                }
                if (c.dataset.type === filter) {
                    c.style.removeProperty('display');
                } else {
                    c.style.display = 'none';
                }
            });
        }

        function renderEvents(data) {
            container.innerHTML = '';
            data.forEach(ev => {
                const card = document.createElement('article');
                card.className = 'event-card';
                card.dataset.type = ev.type;
                const date = new Date(ev.date);
                const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                card.innerHTML = `<h3>${escapeHtml(ev.title)}</h3><p class="event-date">${dateStr} • ${escapeHtml(ev.location)}</p><p>${escapeHtml(ev.description)}</p><p><a href="${ev.link}">En savoir plus</a></p>`;
                container.appendChild(card);
            });
        }

        function escapeHtml(str) {
            return String(str).replace(/[&<>"']/g, function (s) {
                return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
            });
        }

        fetch('../data/events.json').then(r => r.json()).then(loadEvents).catch(() => loadEvents(fallback));

    } catch (err) {
        console.error('events.js error', err);
    }
});