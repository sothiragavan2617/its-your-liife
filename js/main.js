document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. Smooth Anchor Scrolling with Navbar Offset
  // =========================================
  const navbar = document.getElementById("navbar");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      // Ignore empty or single-character hashes
      if (targetId === "#" || targetId.length <= 1) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight + 20; // 20px breathing room

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // =========================================
  // 2. Scroll Spy (Active Nav Link)
  // =========================================
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-link");

  const spyOptions = {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          // Remove active from all, add to matching
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  // =========================================
  // 3. Sticky CTA Visibility (Optimized with IntersectionObserver)
  // =========================================
  const stickyCTA = document.querySelector(".sticky-cta");
  const heroSection = document.querySelector("#hero");

  if (stickyCTA && heroSection) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If hero section is no longer visible (user scrolled past it)
          if (!entry.isIntersecting) {
            stickyCTA.classList.add("visible");
          } else {
            stickyCTA.classList.remove("visible");
          }
        });
      },
      { threshold: 0 },
    );

    ctaObserver.observe(heroSection);
  }

  // =========================================
  // 4. FAQ Accordion Logic
  // =========================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          const otherButton = otherItem.querySelector(".faq-question");
          if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current item
      item.classList.toggle("active", !isActive);
      button.setAttribute("aria-expanded", !isActive);
    });
  });
});



// =========================================
// 5. Animated Counters for Stats
// =========================================
const stats = document.querySelectorAll(".stat-num");

// Helper to animate the count
const animateCount = (el) => {
  const target = +el.getAttribute("data-target");
  const suffix = el.innerText.includes("+") ? "+" : "";
  let current = 0;
  const increment = target / 60; // Speed of animation

  const updateCount = () => {
    current += increment;
    if (current < target) {
      el.innerText = Math.ceil(current) + suffix;
      requestAnimationFrame(updateCount);
    } else {
      el.innerText = target.toLocaleString() + suffix; // Adds commas for 1,000+
    }
  };
  updateCount();
};

// Set up observer to trigger when scrolled into view
const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

// Initialize stats with data-targets
stats.forEach((stat) => {
  const text = stat.innerText.replace(/,/g, "");
  const number = parseInt(text.match(/\d+/)[0]);
  stat.setAttribute("data-target", number);
  stat.innerText = "0"; // Reset to 0 on load
  statsObserver.observe(stat);
});


// =========================================
// 6. 3D Tilt Effect on Cards
// =========================================
const tiltCards = document.querySelectorAll(
  ".service-card, .testimonial-card, .gallery-item",
);

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15; // Adjust tilt intensity
    const rotateY = (centerX - x) / 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});


    // =========================================
    // 7. Hero Mouse Parallax
    // =========================================
    const heroSection = document.querySelector('.hero-section');
    const heroVisual = document.querySelector('.hero-visual');
    const heroGlow = document.querySelector('.hero-glow');

    if (heroSection && heroVisual) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            
            // Calculate mouse position from center (-1 to 1)
            const moveX = (clientX / window.innerWidth - 0.5);
            const moveY = (clientY / window.innerHeight - 0.5);
            
            // Move image slightly opposite to mouse for depth
            heroVisual.style.transform = `translate(${moveX * -20}px, ${moveY * -20}px) scale(1.05)`;
            
            // Move glow slightly with mouse
            if (heroGlow) {
                heroGlow.style.transform = `translate(${moveX * 30}px, ${moveY * 30}px)`;
            }
        });
    }

        // =========================================
    // 8. Dynamic Scroll Timeline Progress
    // =========================================
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');

    if (timelineContainer && timelineLine) {
        const handleTimelineScroll = () => {
            const rect = timelineContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Define when the line should start and stop drawing
            // Starts when top of timeline is 80% down the screen
            // Stops when bottom of timeline is 20% down the screen
            const startPoint = windowHeight * 0.8;
            const endPoint = windowHeight * 0.2;
            
            // Calculate how far the container has scrolled past the start point
            let scrolled = startPoint - rect.top;
            let totalScrollable = rect.height - (startPoint - endPoint);
            
            // Calculate percentage (0 to 100)
            let progress = (scrolled / totalScrollable) * 100;
            progress = Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
            
            // Update the CSS variable
            timelineLine.style.setProperty('--scroll-progress', progress + '%');
        };

        // Listen to scroll (passive for performance)
        window.addEventListener('scroll', handleTimelineScroll, { passive: true });
        
        // Initialize on load
        handleTimelineScroll();
    }