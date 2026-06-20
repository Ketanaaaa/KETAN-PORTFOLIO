'use strict';

// portfolio js — vanilla only, no frameworks
// DecodeLabs Project 1 | Ketan Tripathi


// 1. hamburger menu
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

function openMenu() {
  hamburger.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
  hamburger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
});

// Close when a link is clicked
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});


// 2. typing animation
const typedEl = document.querySelector('.typed-text');

const phrases = [
  'ML Models',
  'Computer Vision Apps',
  'Responsive Websites',
  'YOLOv8 Detectors',
  'Generative AI Apps'
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

function runTyping() {
  const current = phrases[phraseIndex];

  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);

  charIndex += isDeleting ? -1 : 1;

  let delay = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    delay      = 2000;       // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting   = false;
    phraseIndex  = (phraseIndex + 1) % phrases.length;
    delay        = 350;
  }

  setTimeout(runTyping, delay);
}

// Respect prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  typedEl.textContent = phrases[0];
} else {
  setTimeout(runTyping, 800);
}


// 3. active nav link on scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
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
}, {
  rootMargin: '-45% 0px -55% 0px',
  threshold: 0
});

sections.forEach(s => sectionObserver.observe(s));


// 4. scroll reveal
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for sibling cards
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

// Add stagger delay to grid children
document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card').forEach((el, i) => {
  el.dataset.delay = (i % 3) * 100;
});

revealEls.forEach(el => revealObserver.observe(el));


// 5. contact form validation
const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEl  = document.getElementById('cf-name');
  const emailEl = document.getElementById('cf-email');
  const msgEl   = document.getElementById('cf-msg');

  const nameErr  = nameEl.nextElementSibling;
  const emailErr = emailEl.nextElementSibling;
  const msgErr   = msgEl.nextElementSibling;

  // Clear previous errors
  [nameErr, emailErr, msgErr].forEach(el => el.textContent = '');
  [nameEl, emailEl, msgEl].forEach(el => el.style.borderColor = '');

  let valid = true;

  if (!nameEl.value.trim()) {
    nameErr.textContent = 'Please enter your name.';
    nameEl.style.borderColor = '#c0392b';
    valid = false;
  }

  if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
    emailErr.textContent = 'Please enter a valid email address.';
    emailEl.style.borderColor = '#c0392b';
    valid = false;
  }

  if (!msgEl.value.trim()) {
    msgErr.textContent = 'Please write a message.';
    msgEl.style.borderColor = '#c0392b';
    valid = false;
  }

  if (!valid) return;

  // actually send the form data to formspree, which forwards it to my email
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent  = 'Sending…';
  submitBtn.disabled     = true;
  submitBtn.style.opacity = '0.7';

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(res => {
      if (res.ok) {
        showToast('Message sent! I\'ll get back to you soon. 🎉', 'success');
        form.reset();
      } else {
        showToast('Something went wrong. Please try emailing me directly.', 'error');
      }
    })
    .catch(() => {
      showToast('Network error. Please try emailing me directly.', 'error');
    })
    .finally(() => {
      submitBtn.textContent  = 'Send Message';
      submitBtn.disabled     = false;
      submitBtn.style.opacity = '1';
    });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// 6. toast notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className   = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast-show'));
  });

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}


// 7. navbar shadow on scroll
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });


// 8. smooth scroll anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Restore focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});
