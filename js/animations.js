document.addEventListener('DOMContentLoaded', () => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Handle Reduced Motion: Reveal everything immediately and exit
    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        return;
    }

    // 2. Hero Section Load Animation
    // Animates hero elements immediately on page load, respecting data-delay.
    const heroElements = document.querySelectorAll('.hero-section .reveal');
    heroElements.forEach(el => {
        const delay = parseInt(el.getAttribute('data-delay')) || 0;
        setTimeout(() => el.classList.add('is-visible'), 100 + delay);
    });

    // 3. Scroll Reveal Animation for remaining sections
    const scrollRevealElements = document.querySelectorAll('.section .reveal, .footer .reveal');

    // Configuration for the Intersection Observer
    const observerOptions = {
        threshold: 0.15,               // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjusts the bounding box (triggers slightly before fully in view)
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                
                // Apply the 'is-visible' class after the specified delay
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                // Stop observing the element once it has been revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Start observing target elements
    scrollRevealElements.forEach(el => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('cfTrack');
  const cards = track ? Array.from(track.querySelectorAll('.cf-card')) : [];
  
  // Exit if no cards found
  if (cards.length === 0) return;

  const prevBtn = document.getElementById('cfPrev');
  const nextBtn = document.getElementById('cfNext');
  let currentIndex = 0;

  // Lightbox Elements
  const lightbox = document.getElementById('testimonialLightbox');
  const lbImg = document.getElementById('tLbImg');
  const lbOverlay = document.getElementById('tLbOverlay');
  const lbClose = document.getElementById('tLbClose');
  const lbPrev = document.getElementById('tLbPrev');
  const lbNext = document.getElementById('tLbNext');

  function updateCarousel() {
    cards.forEach((card, i) => {
      let offset = i - currentIndex;
      
      // Infinite loop calculation
      if (offset > cards.length / 2) offset -= cards.length;
      if (offset < -cards.length / 2) offset += cards.length;

      const absOffset = Math.abs(offset);
      let scale = 1, opacity = 1, zIndex = 10, tx = 0, tz = 0, ry = 0;

      if (absOffset === 0) {
        // Center Card
        scale = 1; opacity = 1; zIndex = 10; tx = 0; tz = 0; ry = 0;
        card.classList.add('is-center');
      } else if (absOffset === 1) {
        // Side Cards
        scale = 0.75; opacity = 0.65; zIndex = 9; tx = offset * 220; tz = -100; ry = offset * -25;
        card.classList.remove('is-center');
      } else if (absOffset === 2) {
        // Far Cards
        scale = 0.55; opacity = 0.3; zIndex = 8; tx = offset * 180; tz = -200; ry = offset * -35;
        card.classList.remove('is-center');
      } else {
        // Hidden Cards
        scale = 0.4; opacity = 0; zIndex = 0; tx = offset * 140; tz = -300; ry = offset * -45;
        card.classList.remove('is-center');
      }

      // Mobile optimization (hide side cards completely)
      if (window.innerWidth <= 768 && absOffset > 0) {
        scale = 0.5; opacity = 0; tx = offset * 100; tz = -200; ry = 0;
      }

      card.style.setProperty('--tx', `${tx}px`);
      card.style.setProperty('--tz', `${tz}px`);
      card.style.setProperty('--scale', scale);
      card.style.setProperty('--opacity', opacity);
      card.style.setProperty('--z', zIndex);
      card.style.setProperty('--ry', `${ry}deg`);
    });
  }

  function moveNext() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }

  function movePrev() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  // Button Events
  nextBtn.addEventListener('click', moveNext);
  prevBtn.addEventListener('click', movePrev);

  // Card Click Events
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (card.classList.contains('is-center')) {
        openLightbox(i); // Open lightbox if center card is clicked
      } else {
        currentIndex = i; // Shift to center if side card is clicked
        updateCarousel();
      }
    });
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    // Lightbox specific controls
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') movePrev();
      if (e.key === 'ArrowRight') moveNext();
      return;
    }
    
    // Global carousel controls
    if (e.key === 'ArrowLeft') movePrev();
    if (e.key === 'ArrowRight') moveNext();
  });

  // =========================================
  // Lightbox Logic
  // =========================================
  function openLightbox(index) {
    currentIndex = index;
    updateImage();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateImage() {
    updateCarousel(); // Sync carousel position with lightbox
    const img = cards[currentIndex].querySelector('img');
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbImg.style.opacity = '1';
    }, 200);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); moveNext(); });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); movePrev(); });

  // Swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) moveNext(); else movePrev();
    }
  }, { passive: true });

  // Smooth fade-in transition setup for modal image
  lbImg.style.transition = 'opacity 0.3s ease';

  // Initialize carousel
  updateCarousel();

  // Update on resize
  window.addEventListener('resize', updateCarousel);
});