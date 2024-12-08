document.addEventListener('DOMContentLoaded', function() {
    // Add scroll event listener for navbar
    const navbar = document.querySelector('.top-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const trainersGrid = document.querySelector('.trainers-grid');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const cardWidth = 260; // Width of card + gap
    
    // Initially hide prev button
    prevBtn.classList.add('disabled');
    
    // Next button click handler
    nextBtn.addEventListener('click', () => {
        trainersGrid.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
        updateButtons();
    });
    
    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        trainersGrid.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
        updateButtons();
    });
    
    // Update button states
    function updateButtons() {
        const scrollLeft = trainersGrid.scrollLeft;
        const maxScroll = trainersGrid.scrollWidth - trainersGrid.clientWidth;
        
        // Update prev button state
        if (scrollLeft <= 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        // Update next button state
        if (scrollLeft >= maxScroll) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    // Auto slide functionality
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const maxScroll = trainersGrid.scrollWidth - trainersGrid.clientWidth;
            const currentScroll = trainersGrid.scrollLeft;
            
            if (currentScroll >= maxScroll) {
                // Reset to start when reached end
                trainersGrid.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                trainersGrid.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            }
            updateButtons();
        }, 3000); // Slides every 3 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto sliding
    startAutoSlide();
    
    // Pause on hover
    trainersGrid.addEventListener('mouseenter', stopAutoSlide);
    trainersGrid.addEventListener('mouseleave', startAutoSlide);
    
    // Pause on button click
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        setTimeout(startAutoSlide, 5000); // Resume after 5 seconds
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        setTimeout(startAutoSlide, 5000); // Resume after 5 seconds
    });
    
    // Initial button state
    updateButtons();

    // Add this to your existing script.js
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
});




// Add this to your existing script.js
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