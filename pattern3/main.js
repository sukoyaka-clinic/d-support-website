// ========================================
// D.support Pattern 3
// Side Navigation + Vertical Text
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    initScrollAnimations();
    initCountUp();
  } else {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
});

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;

        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// ========================================
// Count Up Animation
// ========================================
function initCountUp() {
  const countElements = document.querySelectorAll('[data-count]');
  if (countElements.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateCount(el, 0, target, 2000);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  countElements.forEach(el => observer.observe(el));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = Math.floor(start + (end - start) * easedProgress);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = end;
    }
  }

  requestAnimationFrame(update);
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      if (mobileNav) {
        mobileNav.classList.toggle('active');
      }
      document.body.style.overflow = menuToggle.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile nav on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        if (menuToggle) {
          menuToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
      });
    });
  }
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        const offsetTop = target.offsetTop;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileNav = document.querySelector('.mobile-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        if (mobileNav && menuToggle) {
          mobileNav.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// ========================================
// Active Navigation
// ========================================
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.side-menu a');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-20% 0px -60% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
