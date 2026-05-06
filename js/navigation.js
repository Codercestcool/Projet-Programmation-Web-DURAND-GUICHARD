document.addEventListener('DOMContentLoaded', function () {
    try {
        const nav = document.getElementById('main-nav');
        const toggle = document.querySelector('.nav-toggle');
        const originalParent = nav ? nav.parentElement : null;
        if (toggle && nav) {
            const openMenu = () => {
                if (originalParent && nav.parentElement !== document.body) {
                    document.body.appendChild(nav);
                }
                nav.style.position = 'fixed';
                nav.style.inset = '0';
                nav.style.width = '100%';
                nav.style.height = '100vh';
                nav.style.minHeight = '100vh';
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.justifyContent = 'flex-start';
                nav.style.alignItems = 'stretch';
                nav.style.padding = '0';
                nav.style.zIndex = '2000';
                nav.style.top = '0';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.margin = '0';
                nav.style.borderRadius = '0';
                nav.style.width = '100vw';
                nav.style.boxSizing = 'border-box';
                nav.style.overflowY = 'auto';
                nav.style.overflowX = 'hidden';
                nav.style.background = 'rgba(5, 20, 40, 0.75)';
                nav.style.backdropFilter = 'blur(10px)';
                nav.style.webkitOverflowScrolling = 'touch';
                nav.classList.add('nav-open');
                document.body.classList.add('nav-open-active');
            };

            const closeMenu = () => {
                nav.classList.remove('nav-open');
                document.body.classList.remove('nav-open-active');
                toggle.setAttribute('aria-expanded', 'false');
                nav.style.cssText = '';
                if (originalParent && nav.parentElement !== originalParent) {
                    originalParent.appendChild(nav);
                }
            };

            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!expanded));
                if (!expanded) {
                    openMenu();
                    // focus first link
                    const firstLink = nav.querySelector('a[href]');
                    firstLink && firstLink.focus();
                } else {
                    closeMenu();
                }
            });

            // Ensure proper display on resize (CSS media queries handle it, but JS ensures toggle works)
            const updateToggleVisibility = () => {
                try {
                    if (window.innerWidth <= 900) {
                        toggle.style.setProperty('display', 'inline-flex', 'important');
                        toggle.style.setProperty('z-index', '2200', 'important');
                    } else {
                        toggle.style.removeProperty('display');
                        toggle.style.removeProperty('z-index');
                    }
                } catch (e) { /* ignore */ }
            };
            updateToggleVisibility();
            window.addEventListener('resize', updateToggleVisibility);

            // Close when clicking a nav link
            nav.addEventListener('click', (e) => {
                const target = e.target;
                if (target.tagName === 'A' && nav.classList.contains('nav-open')) {
                    closeMenu();
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
                    closeMenu();
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