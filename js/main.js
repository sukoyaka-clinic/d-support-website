/**
 * D.support - Premium Animation System
 * GSAP + ScrollTrigger powered animations
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initLenis();
  initHeader();
  initHeroAnimations();
  initScrollAnimations();
  initCounterAnimations();
  initMagneticButtons();
  initCursor();
  initMobileMenu();
});

/**
 * Lenis Smooth Scroll
 */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Connect to GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Use GSAP if available, otherwise fallback
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.to('.hero-label', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3
    })
    .to('.hero-title .line', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.15
    }, '-=0.5')
    .to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 1
    }, '-=0.8')
    .to('.hero-buttons', {
      opacity: 1,
      y: 0,
      duration: 1
    }, '-=0.8')
    .to('.hero-scroll', {
      opacity: 1,
      duration: 1
    }, '-=0.5');

  } else {
    // Fallback animations without GSAP
    setTimeout(() => {
      document.querySelectorAll('.hero-label, .hero-title .line, .hero-description, .hero-buttons, .hero-scroll').forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        }, i * 150);
      });
    }, 300);
  }
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
  // Use GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Stagger animations for grids
    gsap.utils.toArray('.services-grid, .testimonials-grid, .features-grid, .stats-grid').forEach((grid) => {
      const items = grid.children;
      gsap.fromTo(items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Parallax effect for orbs
    gsap.utils.toArray('.hero-orb').forEach((orb) => {
      gsap.to(orb, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // Section title animations
    gsap.utils.toArray('.section-header, .services-header, .features-header').forEach((header) => {
      const label = header.querySelector('.text-caption, .section-label');
      const title = header.querySelector('h2');
      const desc = header.querySelector('p');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (label) {
        tl.fromTo(label,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
        );
      }
      if (title) {
        tl.fromTo(title,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
          '-=0.6'
        );
      }
      if (desc) {
        tl.fromTo(desc,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
          '-=0.6'
        );
      }
    });

  } else {
    // Fallback: Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      revealObserver.observe(el);
    });

    // Stagger children
    document.querySelectorAll('.services-grid, .testimonials-grid, .features-grid').forEach((grid) => {
      const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((child, i) => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
                child.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
              }, i * 150);
            });
            gridObserver.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Set initial state
      Array.from(grid.children).forEach((child) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(60px)';
      });

      gridObserver.observe(grid);
    });
  }
}

/**
 * Counter animations
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2500;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(target * easedProgress);

      counter.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Use GSAP ScrollTrigger or Intersection Observer
  if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
    counters.forEach((counter) => {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: () => animateCounter(counter),
        once: true
      });
    });
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }
}

/**
 * Magnetic button effect
 */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/**
 * Custom cursor
 */
function initCursor() {
  // Only on desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const updateCursor = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(updateCursor);
  };

  updateCursor();

  // Scale up on hovering interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .testimonial-card, .feature-card');

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  const navList = document.querySelector('.nav-list');

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');

    // Animate menu button
    const spans = menuBtn.querySelectorAll('span');
    if (nav.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';

      // Show nav list on mobile
      if (navList) {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'fixed';
        navList.style.top = '80px';
        navList.style.left = '0';
        navList.style.right = '0';
        navList.style.bottom = '0';
        navList.style.background = 'rgba(10, 22, 40, 0.98)';
        navList.style.padding = '2rem';
        navList.style.justifyContent = 'center';
        navList.style.alignItems = 'center';
        navList.style.gap = '2rem';
      }
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';

      if (navList) {
        navList.style.display = '';
        navList.style.flexDirection = '';
        navList.style.position = '';
        navList.style.top = '';
        navList.style.left = '';
        navList.style.right = '';
        navList.style.bottom = '';
        navList.style.background = '';
        navList.style.padding = '';
        navList.style.justifyContent = '';
        navList.style.alignItems = '';
        navList.style.gap = '';
      }
    }
  });

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuBtn.classList.remove('active');
      const spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';

      if (navList) {
        navList.style.display = '';
      }
    });
  });
}

/**
 * Split text into characters/words for animation
 */
function splitText(element, type = 'chars') {
  const text = element.textContent;
  element.innerHTML = '';

  if (type === 'chars') {
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
    });
  } else if (type === 'words') {
    text.split(' ').forEach((word, i, arr) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      element.appendChild(span);
      if (i < arr.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }
}

/**
 * Preloader (optional)
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    } else {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
      }, 500);
    }
  });
}
