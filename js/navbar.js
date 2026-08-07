document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    // Safety check: Exit if elements don't exist on the page
    if (!navbar || !hamburger || !mobileMenu) return;

    // =========================================
    // 1. Scroll Effect for Navbar Background
    // =========================================
    const handleScroll = () => {
        // Toggle 'scrolled' class based on scroll position
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    // Listen for scroll (passive: true improves mobile performance)
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger on load in case page is refreshed halfway down

    // =========================================
    // 2. Mobile Menu Toggle
    // =========================================
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // =========================================
    // 3. Accessibility & Edge Cases
    // =========================================
    
    // Close menu if Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu if window is resized to desktop (preails over 900px breakpoint)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});