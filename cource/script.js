// Navigation scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.top-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.menu-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    mobileMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    // Create overlay if it doesn't exist
    if (!menuOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Toggle overlay
    document.querySelector('.menu-overlay').classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
        document.querySelector('.menu-overlay')?.classList.remove('active');
    }
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});