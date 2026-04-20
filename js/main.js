/* ==========================================================
   MY GARDEN ROOMS — Main JavaScript
   Handles: Navigation, Scroll animations, Testimonial slider,
            Portfolio filter, Price table toggle, Form validation,
            Back-to-top button
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Navigation Toggle ──────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.classList.toggle('open');
      // Prevent body scroll when menu is open
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  /* ── Sticky Header + Active Nav Link ────────────────── */
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateHeader() {
    // Add scrolled class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ── Scroll-triggered Animations ────────────────────── */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once animated
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));


  /* ── Testimonial Slider ─────────────────────────────── */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let currentSlide = 0;
  let autoSlideInterval;

  function goToSlide(index) {
    // Wrap around
    if (index < 0) index = testimonialCards.length - 1;
    if (index >= testimonialCards.length) index = 0;

    testimonialCards.forEach((card, i) => {
      card.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });

    testimonialCards[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetAutoSlide();
    });
  });

  if (testimonialCards.length > 0) {
    startAutoSlide();
  }


  /* ── Portfolio Filter ───────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items with animation
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ── Price Table Toggle ─────────────────────────────── */
  const toggleBtn = document.getElementById('toggle-price-table');
  const priceTable = document.getElementById('price-table');

  if (toggleBtn && priceTable) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = priceTable.hidden;
      priceTable.hidden = !isHidden;
      toggleBtn.textContent = isHidden ? 'Hide Full Price Guide' : 'View Full Price Guide';

      if (isHidden) {
        priceTable.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }


  /* ── Contact Form Validation ────────────────────────── */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic client-side validation
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      let isValid = true;

      // Reset previous error styles
      [name, email, message].forEach(field => {
        field.style.borderColor = '';
      });

      if (!name.value.trim()) {
        name.style.borderColor = '#e74c3c';
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.style.borderColor = '#e74c3c';
        isValid = false;
      }

      if (!message.value.trim()) {
        message.style.borderColor = '#e74c3c';
        isValid = false;
      }

      if (!isValid) {
        formStatus.textContent = 'Please fill in all required fields correctly.';
        formStatus.className = 'form-status error';
        return;
      }

      // Simulate form submission (replace with actual endpoint)
      formStatus.textContent = 'Thank you! Your message has been sent. We\'ll be in touch shortly.';
      formStatus.className = 'form-status success';
      form.reset();

      // Clear status after 5 seconds
      setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 5000);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ── Back to Top Button ─────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── Smooth anchor scrolling (fallback) ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});


/* ── CSS animation keyframes injected via JS ──────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
