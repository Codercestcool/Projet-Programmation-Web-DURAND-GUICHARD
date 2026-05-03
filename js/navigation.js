document.addEventListener('DOMContentLoaded', function () {
    try {
        const nav = document.getElementById('main-nav');
        const toggle = document.querySelector('.nav-toggle');
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!expanded));
                nav.classList.toggle('nav-open');
                if (!expanded) {
                    // focus first link
                    const firstLink = nav.querySelector('a[href]');
                    firstLink && firstLink.focus();
                }
            });

            // Close when clicking a nav link
            nav.addEventListener('click', (e) => {
                const target = e.target;
                if (target.tagName === 'A' && nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });
        }

        // Active link detection
        const links = document.querySelectorAll('.header-nav a[href]');
        if (links.length) {
            const current = window.location.pathname.split('/').pop();
            links.forEach(a => {
                const href = a.getAttribute('href');
                if (href === current || (href && current && current.indexOf(href) !== -1)) {
                    a.classList.add('active');
                }
            });
        }

    } catch (err) {
        console.error('navigation.js error', err);
    }
});