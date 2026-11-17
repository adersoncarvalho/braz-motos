document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initBusinessStatus();
  initHeroCarousel();
  initGalleryLightbox();
  initRevealAnimations();
  initCurrentYear();
});

function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const savedTheme = localStorage.getItem('braz-motos-theme');

  const applySystemTheme = (isLight) => {
    root.setAttribute('data-theme', isLight ? 'light' : 'dark');
  };

  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  } else {
    applySystemTheme(mediaQuery.matches);
  }

  // Atualiza automaticamente se o tema do Windows/navegador mudar (quando não houver escolha manual salva)
  mediaQuery.addEventListener('change', (event) => {
    if (!localStorage.getItem('braz-motos-theme')) {
      applySystemTheme(event.matches);
    }
  });

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('braz-motos-theme', next);
  });
}

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initBusinessStatus() {
  const statusPill = document.getElementById('status-pill');
  const statusText = document.getElementById('status-text');
  if (!statusPill || !statusText) return;

  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();

  let isOpen = false;
  if (day >= 1 && day <= 5) {
    isOpen = minutes >= 8 * 60 && minutes < 18 * 60;
  } else if (day === 6) {
    isOpen = minutes >= 8 * 60 && minutes < 12 * 60;
  }

  statusPill.classList.remove('is-open', 'is-closed');
  if (isOpen) {
    statusPill.classList.add('is-open');
    statusText.textContent = 'Aberto agora';
  } else {
    statusPill.classList.add('is-closed');
    statusText.textContent = 'Fechado no momento • Agende pelo WhatsApp';
  }
}

function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

function initHeroCarousel() {
  const carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.hero-carousel__slide'));
  const dots = Array.from(carousel.querySelectorAll('.hero-carousel__dot'));
  const prevBtn = carousel.querySelector('.hero-carousel__btn--prev');
  const nextBtn = carousel.querySelector('.hero-carousel__btn--next');
  if (slides.length < 2) return;

  let current = 0;
  let timer = null;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  };

  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => goTo(current + 1), 4500);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  startAuto();
}

function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('.gallery-card__trigger');

  if (!lightbox || !lightboxImg || !lightboxCaption || !triggers.length) return;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-full');
      const caption = btn.getAttribute('data-caption') || '';
      const imgEl = btn.querySelector('img');
      if (!src) return;

      lightboxImg.src = src;
      lightboxImg.alt = imgEl ? imgEl.alt : caption;
      lightboxCaption.textContent = caption;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
