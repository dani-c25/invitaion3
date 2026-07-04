/* ══════════════════════════════════
   ROYAL WEDDING — script.js
   Ahmad & Samara — 16 Août 2026
══════════════════════════════════ */

const WEDDING_DATE = new Date('2026-08-16T17:30:00');

/* ── SPLASH ── */
(function() {
  const splash = document.getElementById('splash');
  const btn    = document.getElementById('splash-btn');
  const main   = document.getElementById('main-content');
  const nav    = document.getElementById('liquid-nav');

  if (!splash || !btn) return;
  document.body.style.overflow = 'hidden';

  btn.addEventListener('click', open);
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });

  function open() {
    splash.classList.add('opening');
    // Spawn particles on splash btn click
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 20);

    setTimeout(() => {
      splash.style.display = 'none';
      main.classList.remove('hidden');
      nav.classList.remove('hidden');
      nav.classList.add('visible');
      document.body.style.overflow = '';
      initCountdown();
      initScrollReveal();
      initParallax();
    }, 1050);
  }
})();

/* ══════════════════════════════════
   COUNTDOWN — fixed slide animation
══════════════════════════════════ */
function initCountdown() {
  const ids   = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];
  const prev  = [null, null, null, null];
  const order = ['days', 'hours', 'minutes', 'seconds'];

  function getTime() {
    const diff = WEDDING_DATE - new Date();
    if (diff <= 0) return [0, 0, 0, 0];
    return [
      Math.floor(diff / 86400000),
      Math.floor((diff % 86400000) / 3600000),
      Math.floor((diff % 3600000)  / 60000),
      Math.floor((diff % 60000)    / 1000)
    ];
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function animateSlot(trackEl, val) {
    // Remove any exiting slide
    const exiting = trackEl.querySelector('.slide-exit');
    if (exiting) exiting.remove();

    // Mark current as exiting
    const current = trackEl.querySelector('.countdown-slide:not(.slide-exit)');
    if (current) {
      current.classList.add('slide-exit');
      setTimeout(() => current.remove(), 450);
    }

    // Create new slide entering from top
    const next = document.createElement('div');
    next.className = 'countdown-slide slide-enter';
    next.textContent = pad(val);
    trackEl.appendChild(next);
  }

  function tick() {
    const vals = getTime();
    vals.forEach((v, i) => {
      if (v !== prev[i]) {
        const track = document.getElementById(ids[i]);
        if (track) animateSlot(track, v);
        prev[i] = v;
      }
    });
  }

  tick();
  setInterval(tick, 1000);
}

/* ── PARALLAX RING ── */
function initParallax() {
  const ring = document.getElementById('ring-wrap');
  if (!ring) return;
  window.addEventListener('scroll', () => {
    ring.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in-view'), 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════
   PARTICLES  — BUTTONS ONLY
══════════════════════════════════ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const particles = [];

if (canvas) {
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  drawLoop();
}

function spawnParticles(x, y, count = 14) {
  const COLORS = ['#C9A86A','#B8963A','#E8D5A3','#7A1530','#F5ECD7','#ffffff'];
  const SHAPES = ['heart','star','circle'];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const spd   = 2.5 + Math.random() * 4.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 2.5,
      size: 5 + Math.random() * 9,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      spin: (Math.random() - 0.5) * 0.18,
      rot: Math.random() * Math.PI * 2,
      life: 1
    });
  }
}

function drawLoop() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x  += p.vx; p.y += p.vy;
    p.vy += 0.13; p.vx *= 0.985;
    p.life -= 0.016; p.rot += p.spin;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.3);
      ctx.bezierCurveTo(0,0, -p.size,0, -p.size, p.size*0.4);
      ctx.bezierCurveTo(-p.size, p.size*0.85, 0, p.size*1.1, 0, p.size*1.4);
      ctx.bezierCurveTo(0, p.size*1.1, p.size, p.size*0.85, p.size, p.size*0.4);
      ctx.bezierCurveTo(p.size,0, 0,0, 0, p.size*0.3);
      ctx.fill();
    } else if (p.shape === 'star') {
      ctx.beginPath();
      for (let s = 0; s < 5; s++) {
        const a1 = (s*4*Math.PI)/5 - Math.PI/2;
        const a2 = ((s*4+2)*Math.PI)/5 - Math.PI/2;
        if (s===0) ctx.moveTo(Math.cos(a1)*p.size, Math.sin(a1)*p.size);
        else       ctx.lineTo(Math.cos(a1)*p.size, Math.sin(a1)*p.size);
        ctx.lineTo(Math.cos(a2)*p.size*0.42, Math.sin(a2)*p.size*0.42);
      }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  requestAnimationFrame(drawLoop);
}

/* Attach particles to ALL interactive buttons/links */
function attachParticles(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', e => {
      const r = el.getBoundingClientRect();
      spawnParticles(r.left + r.width/2, r.top + r.height/2);
    });
  });
}

/* Wait for DOM then attach */
document.addEventListener('DOMContentLoaded', () => {
  attachParticles('.nav-item, .btn-map, .btn-modal-send, .rsvp-magic-btn, .contact-btn, #send-congrats');
});

/* ══════════════════════════════════
   NAVBAR ACTIONS
══════════════════════════════════ */
document.getElementById('nav-congrats')?.addEventListener('click', () => {
  document.getElementById('modal-congrats')?.classList.remove('hidden');
});

document.getElementById('nav-calendar')?.addEventListener('click', () => {
  const title    = encodeURIComponent('Mariage de Ahmad & Samara');
  const details  = encodeURIComponent('Salle des Fêtes Benkoli, Annaba');
  const location = encodeURIComponent('Salle Benkoli, Annaba, Algérie');
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260816T173000/20260817T020000&details=${details}&location=${location}`;
  window.open(url, '_blank', 'noopener');
});

document.getElementById('nav-contact')?.addEventListener('click', () => {
  document.getElementById('modal-contact')?.classList.remove('hidden');
});

document.getElementById('nav-location')?.addEventListener('click', () => {
  window.open('https://maps.app.goo.gl/QZKrBppcyYgTwopr8', '_blank', 'noopener');
});

/* Félicitations send */
document.getElementById('send-congrats')?.addEventListener('click', () => {
  const txt  = document.getElementById('congrats-text')?.value.trim();
  if (!txt) return;
  document.getElementById('congrats-sent')?.classList.remove('hidden');
  const btn = document.getElementById('send-congrats');
  btn.disabled = true; btn.textContent = '✦ Envoyé';
});

/* Close modals */
document.querySelectorAll('.modal-close').forEach(b => {
  b.addEventListener('click', () => b.closest('.modal-overlay').classList.add('hidden'));
});
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.add('hidden'); });
});

/* ── RSVP ── */
document.getElementById('rsvp-btn')?.addEventListener('click', () => {
  const name       = document.getElementById('rsvp-name')?.value.trim();
  const attendance = document.getElementById('rsvp-attendance')?.value;
  if (!name || !attendance) { alert('Veuillez remplir tous les champs.'); return; }

  document.getElementById('rsvp-success')?.classList.remove('hidden');
  document.querySelector('.rsvp-form-wrap .form-group') && null;
  // Optionally POST to Apps Script here
});
