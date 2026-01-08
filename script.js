document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Mobile navigation
  const nav = document.getElementById('nav');
  const mobileToggle = document.getElementById('mobileMenuToggle');

  if (nav && mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }

  // Theme toggle with localStorage
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const saved = localStorage.getItem('techClubTheme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    } else {
      root.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('techClubTheme', next);
    });
  }

  // Hero slider (home page)
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const container = heroSlider.querySelector('.slider-container');
    const slides = Array.from(heroSlider.querySelectorAll('.slide'));
    const dots = Array.from(heroSlider.querySelectorAll('.slider-dot'));
    const prev = heroSlider.querySelector('.slider-arrow.prev');
    const next = heroSlider.querySelector('.slider-arrow.next');
    let index = 0;
    let timer;

    const goTo = (i) => {
      if (!container || !slides.length) return;
      index = (i + slides.length) % slides.length;
      container.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    };

    const start = () => {
      timer = setInterval(() => goTo(index + 1), 5000);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        stop();
        start();
      });
    });

    prev?.addEventListener('click', () => {
      goTo(index - 1);
      stop();
      start();
    });

    next?.addEventListener('click', () => {
      goTo(index + 1);
      stop();
      start();
    });

    heroSlider.addEventListener('mouseenter', stop);
    heroSlider.addEventListener('mouseleave', start);

    goTo(0);
    start();
  }

  // Gallery filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  // Gallery lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const emojiSpan = document.getElementById('lightboxEmoji');
    const captionEl = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    let current = 0;

    const open = (i) => {
      if (!items.length) return;
      current = (i + items.length) % items.length;
      const item = items[current];
      const emoji = item.querySelector('.placeholder-gallery span')?.textContent || '📷';
      const title = item.querySelector('.gallery-overlay h3')?.textContent || '';
      const subtitle = item.querySelector('.gallery-overlay p')?.textContent || '';

      if (emojiSpan) emojiSpan.textContent = emoji;
      if (captionEl) captionEl.textContent = title ? `${title} – ${subtitle}` : subtitle;

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });

    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', () => open(current - 1));
    nextBtn?.addEventListener('click', () => open(current + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') open(current + 1);
      if (e.key === 'ArrowLeft') open(current - 1);
    });
  }

  // Notification helper
  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    existing?.remove();

    const colors = {
      success: '#16a34a',
      error: '#b91c1c',
      info: '#6366f1'
    };

    const toast = document.createElement('div');
    toast.className = 'notification';
    toast.style.background = colors[type] || colors.info;
    toast.innerHTML = `
      <span>${message}</span>
      <button type="button" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => toast.remove());

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = contactForm.elements['name'];
      const email = contactForm.elements['email'];
      const subject = contactForm.elements['subject'];
      const message = contactForm.elements['message'];

      const setError = (field, hasError) => {
        const group = field.closest('.form-group');
        if (!group) return;
        group.classList.toggle('error', hasError);
        if (hasError) valid = false;
      };

      setError(name, !name.value.trim());

      const emailVal = email.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      setError(email, !emailVal || !emailValid);

      setError(subject, !subject.value);
      setError(message, !message.value.trim());

      if (!valid) {
        showNotification('Please fix the errors in the form.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const original = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification('Thank you! Your message has been sent (demo).', 'success');
        contactForm.reset();
        contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
        submitBtn.textContent = original;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  // Video placeholders
  document.querySelectorAll('.video-placeholder').forEach(el => {
    el.addEventListener('click', () => {
      showNotification('Video playback coming soon (demo).', 'info');
    });
  });

  // Membership buttons
  document.querySelectorAll('.membership-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.membership-card');
      const title = card?.querySelector('h3')?.textContent || 'Membership';
      showNotification(`${title} signup coming soon (demo).`, 'info');
    });
  });
});

// Simple fade-in on page load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
