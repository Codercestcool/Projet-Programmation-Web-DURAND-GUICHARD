document.addEventListener('DOMContentLoaded', function () {
    try {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const tableRows = document.querySelectorAll('.career-table tbody tr');

        if (!filterButtons.length || !tableRows.length) return;

        function setActive(button) {
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
        }

        function applyFilter(filter) {
            tableRows.forEach(row => {
                const cat = (row.dataset.category || '').toLowerCase();
                if (filter === 'all' || !filter) {
                    row.style.display = '';
                } else {
                    row.style.display = (cat.indexOf(filter) !== -1) ? '' : 'none';
                }
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const filter = this.dataset.filter;
                setActive(this);
                applyFilter(filter);
            });
        });

    } catch (err) {
        // Fail silently — script must not break the page
        console.error('partners.js error', err);
    }
});