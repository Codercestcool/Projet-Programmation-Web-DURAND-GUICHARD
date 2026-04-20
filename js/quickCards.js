document.addEventListener('DOMContentLoaded', function() {
    const quickCards = document.querySelectorAll('.quick-card');
    const homePage = document.body.classList.contains('accueil-page');
    
    quickCards.forEach(card => {
        let hoverTimeout;
        const overlay = card.querySelector('.quick-card-overlay');
        const overlayText = card.getAttribute('data-overlay-text');
        
        card.addEventListener('mouseenter', function() {
            hoverTimeout = setTimeout(() => {
                overlay.textContent = overlayText;
                overlay.classList.add('active');
            }, 500);
        });
        
        card.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            overlay.classList.remove('active');
        });
    });

    if (homePage) {
        const updateHeaderState = function() {
            document.body.classList.toggle('is-scrolled', window.scrollY > 0);
        };

        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState, { passive: true });
    }
});
