document.addEventListener('DOMContentLoaded', function() {
    const quickCards = document.querySelectorAll('.quick-card');
    
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
});
