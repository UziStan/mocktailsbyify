/**
 * mocktailsbyify — Main JavaScript
 * Handles: scroll reveal, navbar, mobile menu, testimonials carousel, contact form
 */

(function () {
  'use strict';

  // ═══════════════════════════════════
  // SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal--scale, .reveal--left');
    if (!reveals.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════
  // NAVBAR SCROLL
  // ═══════════════════════════════════

  function initNavbar() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var scrollThreshold = 50;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ═══════════════════════════════════
  // MOBILE MENU
  // ═══════════════════════════════════

  function initMobileMenu() {
    var hamburger = document.querySelector('.nav__hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      var isOpen = hamburger.classList.contains('is-open');
      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  // ═══════════════════════════════════
  // TESTIMONIALS CAROUSEL
  // ═══════════════════════════════════

  function initTestimonials() {
    var slides = document.querySelectorAll('.testimonials__slide');
    var dots = document.querySelectorAll('.testimonials__dot');
    var prevBtn = document.querySelector('.testimonials__arrow--prev');
    var nextBtn = document.querySelector('.testimonials__arrow--next');
    if (!slides.length) return;

    var current = 0;
    var total = slides.length;
    var autoTimer = null;
    var autoDelay = 5000;
    var isPaused = false;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');

      current = ((index % total) + total) % total;

      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () {
        if (!isPaused) next();
      }, autoDelay);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        startAuto();
      });
    });

    // Pause on hover
    var carousel = document.querySelector('.testimonials');
    if (carousel) {
      carousel.addEventListener('mouseenter', function () { isPaused = true; });
      carousel.addEventListener('mouseleave', function () { isPaused = false; });
    }

    startAuto();
  }

  // ═══════════════════════════════════
  // CONTACT FORM VALIDATION
  // ═══════════════════════════════════

  function initContactForm() {
    var form = document.querySelector('.contact__form');
    if (!form) return;

    var submitBtn = form.querySelector('.contact__submit');
    var successMsg = form.querySelector('.contact__success');

    function validateField(field) {
      var name = field.name;
      var value = field.value.trim();
      var errorEl = form.querySelector('[data-error="' + name + '"]');
      var isValid = true;

      if (field.required && !value) {
        isValid = false;
      }

      if (name === 'email' && value) {
        // Basic email validation
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      field.classList.toggle('is-error', !isValid);
      if (errorEl) {
        errorEl.classList.toggle('is-visible', !isValid);
      }

      return isValid;
    }

    // Live validation on blur
    var fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });

      // Clear error on input
      field.addEventListener('input', function () {
        if (field.classList.contains('is-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all required fields
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          allValid = false;
        }
      });

      if (!allValid) {
        // Focus first error field
        var firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      // Gather form data
      var formData = {};
      fields.forEach(function (field) {
        if (field.name) {
          formData[field.name] = field.value.trim();
        }
      });

      var webhookUrl = form.getAttribute('data-webhook-url');

      if (webhookUrl) {
        // Send to webhook
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
          .then(function (response) {
            if (response.ok) {
              showSuccess();
            } else {
              throw new Error('Failed');
            }
          })
          .catch(function () {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Enquiry <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            alert('Something went wrong. Please try again or email us directly.');
          });
      } else {
        // No webhook — show success (demo mode)
        showSuccess();
      }

      function showSuccess() {
        form.reset();
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';
        if (successMsg) {
          successMsg.hidden = false;
        }
      }
    });
  }

  // ═══════════════════════════════════
  // SMOOTH SCROLL for anchor links
  // ═══════════════════════════════════

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = document.getElementById('nav').offsetHeight;
          var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }

  // ═══════════════════════════════════
  // INITIALIZE
  // ═══════════════════════════════════

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initTestimonials();
    initContactForm();
    initSmoothScroll();
  });
})();
