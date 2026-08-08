/* ============================================================
   PORTFOLIO SCRIPTS
   Includes: Navbar (sticky, hide-on-scroll, scroll-spy,
   mobile menu, theme toggle) + Hero (typing, parallax,
   mouse glow, fade-up animations) + Sections (scroll-reveal,
   counters, skill bars, forms)
   ============================================================ */

'use strict';

/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initForms();
  initFooterYear();
});

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');

  let lastScrollY = window.scrollY;

  /* ---------- Hide on scroll down, show on scroll up ---------- */
  const handleScrollHide = () => {
    const currentY = window.scrollY;

    // Only hide when scrolling down past a threshold
    if (currentY > lastScrollY && currentY > 120) {
      navbar.classList.add('nav-hidden');
      // Close mobile menu when hiding navbar
      closeMobileMenu();
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentY;
  };

  /* ---------- Scroll-spy: highlight active section link ---------- */
  const handleScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-link');

    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinksList.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  /* ---------- Smooth scroll for anchor links ---------- */
  const handleSmoothScroll = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navbarHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    }
  };

  /* ---------- Mobile menu ---------- */
  const openMobileMenu = () => {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  };

  const handleMobileMenu = () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  /* ---------- Theme toggle (dark / light) with persistence ---------- */
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    localStorage.setItem('theme', theme);
  };

  const handleThemeToggle = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  /* ---------- Load saved theme or respect system preference ---------- */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  };

  /* ---------- Event listeners ---------- */
  window.addEventListener('scroll', () => {
    handleScrollHide();
    handleScrollSpy();
  }, { passive: true });

  document.addEventListener('click', handleSmoothScroll);
  hamburger.addEventListener('click', handleMobileMenu);
  themeToggle.addEventListener('click', handleThemeToggle);

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Safety net: close the mobile menu when any menu item is selected
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // Init theme on load
  initTheme();
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function initHero() {
  const typingText = document.getElementById('typingText');
  const mouseGlow = document.getElementById('mouseGlow');
  const hero = document.querySelector('.hero');
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  const fadeUpEls = document.querySelectorAll('.fade-up');

  /* ---------- Typing effect ---------- */
  const words = [
    'AI Engineer',
    'AI Developer',
    'Machine Learning Enthusiast',
    'Fresher',
    'Problem Solver'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 80;      // ms per character while typing
  const deleteSpeed = 45;    // ms per character while deleting
  const pauseTime = 1800;    // ms pause when word is complete

  const type = () => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Delete a character
      charIndex--;
      typingText.textContent = currentWord.substring(0, charIndex);
    } else {
      // Add a character
      charIndex++;
      typingText.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    // Pause when word is fully typed
    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseTime;
      isDeleting = true;
    }
    // Move to next word after fully deleting
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  };

  /* ---------- Mouse parallax effect ---------- */
  const handleMouseParallax = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      const x = (clientX - centerX) * speed;
      const y = (clientY - centerY) * speed;
      // Set CSS custom properties so CSS animations (blob float,
      // image float) can remain intact while parallax is applied.
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    });
  };

  /* ---------- Mouse glow follow ---------- */
  const handleMouseGlow = (e) => {
    const { clientX, clientY } = e;
    const rect = hero.getBoundingClientRect();
    mouseGlow.style.left = `${clientX - rect.left}px`;
    mouseGlow.style.top = `${clientY - rect.top}px`;
  };

  /* ---------- Fade-up animations on load ---------- */
  const triggerFadeUp = () => {
    fadeUpEls.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 150 + index * 120);
    });
  };

  /* ---------- Event listeners ---------- */
  hero.addEventListener('mousemove', (e) => {
    handleMouseParallax(e);
    handleMouseGlow(e);
  });

  // Hide glow on touch devices
  hero.addEventListener('mouseleave', () => {
    mouseGlow.style.opacity = '0';
  });

  hero.addEventListener('mouseenter', () => {
    mouseGlow.style.opacity = '1';
  });

  // Start animations
  type();
  triggerFadeUp();
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  // All elements that use any reveal animation class
  const revealSelectors = [
    '.reveal',
    '.reveal-left',
    '.reveal-right',
    '.reveal-scale',
    '.reveal-rotate',
    '.stagger-children',
    '.timeline-draw',
    '.about-bio',
    '.contact-info',
    '.contact-form',
    '.footer-grid',
    '.footer'
  ];

  const revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  if (!statNumbers.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => observer.observe(el));
  } else {
    // Fallback: set final values
    statNumbers.forEach((el) => {
      el.textContent = el.dataset.count;
    });
  }
}

/* ============================================================
   SKILL BADGES (staggered fade-in animation)
   ============================================================ */
function initSkillBars() {
  const badges = document.querySelectorAll('.skill-badge');

  if (!badges.length) return;

  badges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(12px)';
    badge.style.transition =
      'opacity 0.5s ease, transform 0.5s ease, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease';

    // Stagger each badge within its card
    const siblings = badge.parentElement.children;
    const position = Array.prototype.indexOf.call(siblings, badge);
    badge.style.transitionDelay = `${position * 0.08}s`;
  });

  const revealBadges = () => {
    badges.forEach((badge) => {
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealBadges();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe each category card; when any becomes visible, reveal its badges
    const categories = document.querySelectorAll('.skill-category');
    categories.forEach((cat) => observer.observe(cat));
  } else {
    // Fallback: reveal all badges immediately
    revealBadges();
  }
}

/* ============================================================
   FORMS
   ============================================================ */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');

  /* ---------- Contact form ---------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showFormMessage(contactForm, 'Please fill in all required fields.', 'error');
        return;
      }

      // Simulate form submission (replace with actual API call)
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-label">Sending...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showFormMessage(contactForm, 'Message sent successfully! I\'ll get back to you soon.', 'success');
      }, 1500);
    });
  }

  /* ---------- Newsletter form ---------- */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const input = newsletterForm.querySelector('input[type="email"]');
      const email = input.value.trim();

      if (!email) {
        showFormMessage(newsletterForm, 'Please enter your email.', 'error');
        return;
      }

      input.value = '';
      showFormMessage(newsletterForm, 'Subscribed! Thank you for joining.', 'success');
    });
  }
}

/* ---------- Helper: show a message below a form ---------- */
function showFormMessage(form, message, type) {
  // Remove any existing message
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('p');
  msg.className = `form-message form-message-${type}`;
  msg.textContent = message;
  form.appendChild(msg);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    msg.remove();
  }, 4000);
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}