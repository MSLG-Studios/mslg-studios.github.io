/* ============================================================
   MSLG STUDIOS — script.js
   Handles: theme toggle, language switch, loading screen,
            carousel, scroll reveal
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   TRANSLATIONS
   Add new keys here for every text that needs translating.
   Then reference them in HTML via data-i18n="key".
   ══════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  pl: {
    /* ── navigation ── */
    nav_home:      'Strona Główna',
    nav_games:     'Gry',
    nav_lang:      'EN',
    nav_theme:     'Motyw',

    /* ── loading ── */
    loading_text:  'URUCHAMIANIE SYSTEMU...',

    /* ── index.html ── */
    hero_founded:  'MSLG Studios zostało oficjalnie założone 2 czerwca 2026 roku.',
    hero_start:    'Pierwsze prace nad naszym pierwszym projektem rozpoczęły się 5 maja 2026 roku.',
    hero_tech:     'Tworzymy gry w czystym C++, budując własne rozwiązania i narzędzia przypominające prosty autorski silnik.',
    hero_project:  'Naszym głównym projektem jest Legends of Wpierdol.',
    team_heading:  'Zespół',
    role_dev:      'Główny developer gier.',
    role_fix:      'Bug fixer.',
    role_test:     'Tester gier.',
    social_heading:'Social Media',
    tiktok_btn:    'TikTok',

    /* ── games.html ── */
    games_heading: 'Nasze Gry',
    game1_title:   'Legends of Wpierdol',
    game1_desc:    'Terminalowa gra RPG z systemem walki Turn-Based.',
    game1_tag:     'C++ / TERMINAL RPG',

    /* ── game-legends-of-wpierdol.html ── */
    detail_desc:   'Terminalowa gra RPG z systemem walki Turn-Based.',
    btn_github:    'GitHub',
    btn_releases:  'Releases',
    screenshots_heading: 'Screenshoty',
    screenshot_label: 'SCREENSHOT',

    /* ── footer ── */
    footer_text:   '© 2026 MSLG Studios — Wszelkie prawa zastrzeżone.',
     // pl:
		launcher_banner: 'Zmęczony pobieraniem gier ze strony? Wypróbuj nasz desktopowy launcher!',

  },

  en: {
    /* ── navigation ── */
    nav_home:      'Home',
    nav_games:     'Games',
    nav_lang:      'PL',
    nav_theme:     'Theme',

    /* ── loading ── */
    loading_text:  'BOOTING SYSTEM...',

    /* ── index.html ── */
    hero_founded:  'MSLG Studios was officially founded on June 2, 2026.',
    hero_start:    'Work on our first project began on May 5, 2026.',
    hero_tech:     'We build games in pure C++, crafting our own solutions and tools resembling a simple custom engine.',
    hero_project:  'Our main project is Legends of Wpierdol.',
    team_heading:  'Team',
    role_dev:      'Lead game developer.',
    role_fix:      'Bug fixer.',
    role_test:     'Game tester.',
    social_heading:'Social Media',
    tiktok_btn:    'TikTok',

    /* ── games.html ── */
    games_heading: 'Our Games',
    game1_title:   'Legends of Wpierdol',
    game1_desc:    'A terminal RPG with a turn-based combat system.',
    game1_tag:     'C++ / TERMINAL RPG',

    /* ── game-legends-of-wpierdol.html ── */
    detail_desc:   'A terminal RPG with a turn-based combat system.',
    btn_github:    'GitHub',
    btn_releases:  'Releases',
    screenshots_heading: 'Screenshots',
    screenshot_label: 'SCREENSHOT',

    /* ── footer ── */
    footer_text:   '© 2026 MSLG Studios — All rights reserved.',

// en:
	launcher_banner: 'Tired of downloading games from the website? Try our desktop launcher!',
  }
};

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
let currentLang  = localStorage.getItem('mslg_lang')  || 'pl';
let currentTheme = localStorage.getItem('mslg_theme') || 'dark';

/* ══════════════════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
  localStorage.setItem('mslg_theme', theme);
  currentTheme = theme;
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

/* ══════════════════════════════════════════════════════════
   LANGUAGE / i18n
   ══════════════════════════════════════════════════════════ */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('mslg_lang', lang);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['pl'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  /* update html lang attr */
  document.documentElement.lang = lang;
}

function toggleLang() {
  applyLang(currentLang === 'pl' ? 'en' : 'pl');
}

/* ══════════════════════════════════════════════════════════
   LOADING SCREEN
   ══════════════════════════════════════════════════════════ */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  /* hide after animation finishes */
  setTimeout(() => {
    screen.classList.add('hidden');
    setTimeout(() => screen.remove(), 600);
  }, 1800);
}

/* ══════════════════════════════════════════════════════════
   CAROUSEL
   Number of slides — update SLIDES_TOTAL if you add more.
   ══════════════════════════════════════════════════════════ */
const SLIDES_TOTAL   = 5;
const SLIDE_INTERVAL = 4000; /* ms */

let carouselIndex    = 0;
let carouselTimer    = null;

function initCarousel() {
  const track  = document.querySelector('.carousel-track');
  const dotsEl = document.querySelector('.carousel-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  const total  = slides.length;

  /* create dots */
  if (dotsEl) {
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsEl.appendChild(dot);
    });
  }

  function goToSlide(idx) {
    carouselIndex = (idx + total) % total;

    /* center active slide */
    const activeSlide = slides[carouselIndex];
    const trackRect   = track.parentElement.getBoundingClientRect();
    const slideRect   = activeSlide.getBoundingClientRect();

    /* calculate offset so active is centred in the wrap */
    const wrapCenter  = trackRect.width / 2;
    const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
    const offset      = slideCenter - wrapCenter;

    track.style.transform = `translateX(-${offset}px)`;

    slides.forEach((s, i) => s.classList.toggle('active', i === carouselIndex));

    /* dots */
    document.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === carouselIndex)
    );
  }

  function next() { goToSlide(carouselIndex + 1); }

  function startTimer() {
    carouselTimer = setInterval(next, SLIDE_INTERVAL);
  }

  /* pause on hover */
  track.parentElement.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  track.parentElement.addEventListener('mouseleave', startTimer);

  goToSlide(0);
  startTimer();
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   ACTIVE NAV LINK
   ══════════════════════════════════════════════════════════ */
function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-page') === path);
  });
}

/* ══════════════════════════════════════════════════════════
   WIRE UP BUTTONS
   ══════════════════════════════════════════════════════════ */
function bindButtons() {
  document.querySelectorAll('[data-action="toggle-theme"]')
    .forEach(btn => btn.addEventListener('click', toggleTheme));

  document.querySelectorAll('[data-action="toggle-lang"]')
    .forEach(btn => btn.addEventListener('click', toggleLang));
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);
  markActiveNav();
  bindButtons();
  initLoadingScreen();
  initCarousel();
  initReveal();
});
