/* ══════════════════════════════════════════════════
   GURSAHIB SINGH — PORTFOLIO V3 · SCRIPTS
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Scroll Reveal ─── */
  const rvEls = document.querySelectorAll('.rv');
  const rvObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        rvObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  rvEls.forEach(el => rvObs.observe(el));

  /* ─── Sticky Nav ─── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 50);
  }, { passive: true });

  /* ─── Mobile Menu ─── */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ─── Theme Toggle ─── */
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Apply saved theme on load
  const saved = localStorage.getItem('gs-theme');
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀️';
  }

  themeBtn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      localStorage.setItem('gs-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      themeIcon.textContent = '☀️';
      localStorage.setItem('gs-theme', 'light');
    }
  });

  /* ─── Smooth Scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── Horizontal Scroll Drag (Projects) ─── */
  const track = document.querySelector('.proj-track');
  if (track) {
    let isDown = false, startX, scrollL;
    track.addEventListener('mousedown', e => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollL = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollL - walk;
    });
  }

  /* ─── Skill Pills Stagger Reveal ─── */
  const pills = document.querySelectorAll('.skill-pill');
  pills.forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 0.03}s`;
  });

  /* ─── Dynamic Year in Footer ─── */
  const yearEl = document.getElementById('footYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
