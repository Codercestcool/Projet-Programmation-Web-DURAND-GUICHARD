document.addEventListener('DOMContentLoaded', function () {
    try {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            const panel = item.querySelector('.faq-answer');
            btn.addEventListener('click', () => toggleItem(item));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleItem(item);
                }
            });
        });

        function closeAll() {
            faqItems.forEach(i => {
                const b = i.querySelector('.faq-question');
                const p = i.querySelector('.faq-answer');
                b.setAttribute('aria-expanded', 'false');
                if (p) p.hidden = true;
            });
        }

        function toggleItem(item) {
            const btn = item.querySelector('.faq-question');
            const panel = item.querySelector('.faq-answer');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            closeAll();
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                if (panel) panel.hidden = false;
                panel && panel.focus && panel.focus();
            }
        }

    } catch (err) {
        console.error('faq.js error', err);
    }
});