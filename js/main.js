/**
 * mocktailsbyify — Main JavaScript
 * Handles: scroll reveal, parallax, hero text animation, navbar,
 * mobile menu, testimonials carousel, contact form, magnetic hover
 */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ═══════════════════════════════════
  // HERO TEXT — WORD-BY-WORD REVEAL
  // ═══════════════════════════════════

  function initHeroTextAnimation() {
    var heading = document.querySelector('.hero__heading');
    if (!heading || prefersReduced) return;

    var originalHTML = heading.innerHTML;
    // Preserve the <em> tag by splitting around it
    var parts = originalHTML.split(/(<em[^>]*>.*?<\/em>)/gi);
    var wordIndex = 0;
    var baseDelay = 0.25; // seconds
    var staggerStep = 0.07;

    var newHTML = parts.map(function (part) {
      if (part.match(/^<em/i)) {
        // It's the accent <em> — wrap inner words
        var inner = part.replace(/<em([^>]*)>(.*?)<\/em>/i, function (_, attrs, text) {
          var words = text.trim().split(/\s+/);
          var wrapped = words.map(function (word) {
            var delay = baseDelay + wordIndex * staggerStep;
            wordIndex++;
            return '<span class="hero-word" style="animation-delay:' + delay.toFixed(2) + 's">' + word + '</span>';
          }).join(' ');
          return '<em' + attrs + '>' + wrapped + '</em>';
        });
        return inner;
      } else {
        // Regular text node — wrap each word
        var words = part.trim().split(/\s+/).filter(Boolean);
        return words.map(function (word) {
          var delay = baseDelay + wordIndex * staggerStep;
          wordIndex++;
          return '<span class="hero-word" style="animation-delay:' + delay.toFixed(2) + 's">' + word + '</span>';
        }).join(' ');
      }
    }).join(' ');

    heading.innerHTML = newHTML;
  }

  // ═══════════════════════════════════
  // SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════

  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal--scale, .reveal--left, .reveal--right, .reveal--rotate');
    if (!reveals.length) return;

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
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════
  // PARALLAX on SCROLL
  // ═══════════════════════════════════

  function initParallax() {
    if (prefersReduced) return;

    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      var windowH = window.innerHeight;

      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var rect = el.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var viewCenter = windowH / 2;
        var offset = (elCenter - viewCenter) * speed;

        el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  // ═══════════════════════════════════
  // HERO PARALLAX (blobs react to scroll)
  // ═══════════════════════════════════

  function initHeroParallax() {
    if (prefersReduced) return;

    var heroSection = document.querySelector('.hero');
    var blobs = document.querySelectorAll('.hero__blob');
    var leaf = document.querySelector('.hero__leaf');
    var citrus = document.querySelector('.hero__citrus');
    if (!heroSection || !blobs.length) return;

    var ticking = false;
    var speeds = [0.15, 0.1, 0.2];

    function updateHeroParallax() {
      var scrollY = window.scrollY;
      var heroH = heroSection.offsetHeight;

      if (scrollY > heroH * 1.2) {
        ticking = false;
        return;
      }

      blobs.forEach(function (blob, i) {
        var speed = speeds[i] || 0.1;
        blob.style.transform = 'translateY(' + (scrollY * speed).toFixed(1) + 'px)';
      });

      if (leaf) {
        leaf.style.transform = 'translateY(' + (scrollY * 0.08).toFixed(1) + 'px) rotate(' + (scrollY * 0.02).toFixed(1) + 'deg)';
      }
      if (citrus) {
        citrus.style.transform = 'translateY(' + (scrollY * 0.12).toFixed(1) + 'px) rotate(' + (scrollY * 0.05).toFixed(1) + 'deg)';
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════
  // MAGNETIC HOVER (buttons & socials)
  // ═══════════════════════════════════

  function initMagneticHover() {
    if (prefersReduced) return;

    var magnets = document.querySelectorAll('.magnetic');
    if (!magnets.length) return;

    magnets.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.3;

        el.style.transform = 'translate(' + (x * strength).toFixed(1) + 'px, ' + (y * strength).toFixed(1) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════
  // TILT EFFECT (menu cards)
  // ═══════════════════════════════════

  function initCardTilt() {
    if (prefersReduced) return;

    var cards = document.querySelectorAll('.menu__card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateX = (0.5 - y) * 12;
        var rotateY = (x - 0.5) * 12;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX.toFixed(1) + 'deg) rotateY(' + rotateY.toFixed(1) + 'deg) translateY(-10px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════
  // NAVBAR SCROLL
  // ═══════════════════════════════════

  function initNavbar() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var scrollThreshold = 50;
    var ticking = false;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

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
  // COUNTER ANIMATION (for stats if present)
  // ═══════════════════════════════════

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length || prefersReduced) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════
  // INITIALIZE
  // ═══════════════════════════════════

  document.addEventListener('DOMContentLoaded', function () {
    initHeroTextAnimation();
    initScrollReveal();
    initParallax();
    initHeroParallax();
    initMagneticHover();
    initCardTilt();
    initNavbar();
    initMobileMenu();
    initTestimonials();
    initContactForm();
    initSmoothScroll();
    initCounters();
  });
})();
