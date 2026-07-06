/* Royal Wedding — Ahmad & Samara — 16 Août 2026 */
'use strict';
const WEDDING = new Date('2026-08-16T17:30:00');

/* ══ SPLASH ══ */
(function(){
  const splash = document.getElementById('splash');
  const btn    = document.getElementById('splash-btn');
  const mainEl = document.getElementById('main');
  const nav    = document.getElementById('lnav');
  if(!splash || !btn) return;

  document.body.style.overflow = 'hidden';

  function openSplash(){
    spawnParticles(window.innerWidth/2, window.innerHeight/2, 22);
    splash.classList.add('opening');
    setTimeout(()=>{
      splash.style.display = 'none';
      mainEl.classList.remove('hidden');
      nav.classList.remove('hidden');
      nav.classList.add('visible');
      document.body.style.overflow = '';
      initCountdown();
      initReveal();
      initParallax();
      attachParticles();
    }, 1060);
  }

  btn.addEventListener('click', openSplash);
  btn.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' ') openSplash();
  });
})();

/* ══ COUNTDOWN — works on all browsers ══ */
function initCountdown(){
  const ids  = ['cd-days','cd-hours','cd-minutes','cd-seconds'];
  const prev = [null, null, null, null];

  function getVals(){
    var diff = WEDDING.getTime() - Date.now();
    if(diff <= 0) return [0,0,0,0];
    return [
      Math.floor(diff / 86400000),
      Math.floor((diff % 86400000) / 3600000),
      Math.floor((diff % 3600000)  / 60000),
      Math.floor((diff % 60000)    / 1000)
    ];
  }

  function pad(n){ return String(n).padStart(2,'0'); }

  function animSlot(trackEl, val){
    // Remove old exit
    var ex = trackEl.querySelector('.cds-exit');
    if(ex) ex.remove();

    // Mark current slide as exiting
    var cur = trackEl.querySelector('.cd-slide');
    if(cur){
      cur.classList.add('cds-exit');
      (function(el){ setTimeout(function(){ el.remove(); }, 460); })(cur);
    }

    // Create new entering slide
    var next = document.createElement('div');
    next.className = 'cd-slide cds-enter';
    next.textContent = pad(val);
    trackEl.appendChild(next);
  }

  function tick(){
    var vals = getVals();
    for(var i=0; i<4; i++){
      if(vals[i] !== prev[i]){
        var t = document.getElementById(ids[i]);
        if(t) animSlot(t, vals[i]);
        prev[i] = vals[i];
      }
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* ══ PARALLAX RING ══ */
function initParallax(){
  var ringWrap = document.getElementById('ring-wrap');
  if(!ringWrap) return;

  // After splash open animation finishes, opacity is 1 — we control from here
  var heroH = document.querySelector('.hero-sec').offsetHeight || window.innerHeight;

  window.addEventListener('scroll', function(){
    var sy = window.pageYOffset;
    // Move down faster than page scroll
    var move = sy * 0.22;
    // Fade out: fully gone at 50% of hero height
    var fade = Math.max(0, 1 - (sy / (heroH * 0.5)));
    ringWrap.style.transform = 'translateY(' + move + 'px)';
    ringWrap.style.opacity   = fade;
  }, {passive:true});
}

/* ══ SCROLL REVEAL ══ */
function initReveal(){
  if(!window.IntersectionObserver){
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('in-view');
    });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        setTimeout(function(){ e.target.classList.add('in-view'); }, 60);
        obs.unobserve(e.target);
      }
    });
  }, {threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
}

/* ══ PARTICLES ══ */
var canvas = document.getElementById('pc');
var ctx    = canvas ? canvas.getContext('2d') : null;
var PX     = [];

if(canvas){
  function rsz(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  rsz();
  window.addEventListener('resize', rsz);
  drawLoop();
}

function spawnParticles(x, y, count){
  count = count || 14;
  var C = ['#C9A86A','#B8963A','#E8D5A3','#7A1530','#F5ECD7','#fff'];
  var S = ['heart','star','circle'];
  for(var i=0; i<count; i++){
    var a  = (Math.PI*2*i)/count + Math.random()*.5;
    var sp = 2.5 + Math.random()*4.5;
    PX.push({
      x:x, y:y,
      vx:Math.cos(a)*sp, vy:Math.sin(a)*sp - 2.5,
      size:5 + Math.random()*9,
      color:C[~~(Math.random()*C.length)],
      shape:S[~~(Math.random()*S.length)],
      spin:(Math.random()-.5)*.18,
      rot:Math.random()*Math.PI*2,
      life:1
    });
  }
}

function drawLoop(){
  if(!ctx){ return; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i=PX.length-1; i>=0; i--){
    var p = PX[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += .13;  p.vx *= .985;
    p.life -= .016; p.rot += p.spin;
    if(p.life <= 0){ PX.splice(i,1); continue; }
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if(p.shape==='heart'){
      ctx.beginPath();
      ctx.moveTo(0, p.size*.3);
      ctx.bezierCurveTo(0,0, -p.size,0, -p.size,p.size*.4);
      ctx.bezierCurveTo(-p.size,p.size*.85, 0,p.size*1.1, 0,p.size*1.4);
      ctx.bezierCurveTo(0,p.size*1.1, p.size,p.size*.85, p.size,p.size*.4);
      ctx.bezierCurveTo(p.size,0, 0,0, 0,p.size*.3);
      ctx.fill();
    } else if(p.shape==='star'){
      ctx.beginPath();
      for(var s=0; s<5; s++){
        var a1=(s*4*Math.PI)/5-Math.PI/2, a2=((s*4+2)*Math.PI)/5-Math.PI/2;
        if(s===0) ctx.moveTo(Math.cos(a1)*p.size, Math.sin(a1)*p.size);
        else      ctx.lineTo(Math.cos(a1)*p.size, Math.sin(a1)*p.size);
        ctx.lineTo(Math.cos(a2)*p.size*.42, Math.sin(a2)*p.size*.42);
      }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  requestAnimationFrame(drawLoop);
}

function attachParticles(){
  document.querySelectorAll('.ni,.btn-map,.mbtn,.rsvp-magic-btn,.clink,#send-voeux').forEach(function(el){
    el.addEventListener('click', function(){
      var r = el.getBoundingClientRect();
      spawnParticles(r.left + r.width/2, r.top + r.height/2);
    });
  });
}

/* ══ NAVBAR ══ */
document.getElementById('nav-voeux')?.addEventListener('click',function(){
  document.getElementById('modal-voeux')?.classList.remove('hidden');
});
document.getElementById('nav-agenda')?.addEventListener('click',function(){
  var t = encodeURIComponent('Mariage Ahmad & Samara');
  var l = encodeURIComponent('Salle Benkoli, Naqaus, Batna, Algérie');
  window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text='+t+'&dates=20260816T173000/20260817T020000&location='+l,'_blank','noopener');
});
document.getElementById('nav-contact')?.addEventListener('click',function(){
  document.getElementById('modal-contact')?.classList.remove('hidden');
});
document.getElementById('nav-lieu')?.addEventListener('click',function(){
  window.open('https://maps.app.goo.gl/QZKrBppcyYgTwopr8','_blank','noopener');
});

/* Send voeux */
document.getElementById('send-voeux')?.addEventListener('click',function(){
  var txt = document.getElementById('voeux-txt')?.value.trim();
  if(!txt) return;
  document.getElementById('voeux-sent')?.classList.remove('hidden');
  var b = document.getElementById('send-voeux');
  b.disabled = true; b.textContent = '✦ Envoyé';
});

/* Close modals */
document.querySelectorAll('.mc').forEach(function(b){
  b.addEventListener('click', function(){ b.closest('.modal-ov').classList.add('hidden'); });
});
document.querySelectorAll('.modal-ov').forEach(function(o){
  o.addEventListener('click', function(e){ if(e.target===o) o.classList.add('hidden'); });
});

/* RSVP */
document.getElementById('rsvp-btn')?.addEventListener('click',function(){
  var name = document.getElementById('rsvp-name')?.value.trim();
  var att  = document.getElementById('rsvp-att')?.value;
  if(!name || !att){ alert('Veuillez remplir tous les champs.'); return; }
  document.getElementById('rsvp-ok')?.classList.remove('hidden');
});
