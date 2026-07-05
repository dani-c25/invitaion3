/* Royal Wedding — Ahmad & Samara — 16 Août 2026 */
const WEDDING = new Date('2026-08-16T17:30:00');

/* ══ SPLASH ══ */
(function(){
  const splash = document.getElementById('splash');
  const btn    = document.getElementById('splash-btn');
  const main   = document.getElementById('main');
  const nav    = document.getElementById('lnav');
  if(!splash||!btn) return;
  document.body.style.overflow='hidden';
  btn.addEventListener('click', open);
  btn.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') open(); });
  function open(){
    spawnParticles(window.innerWidth/2, window.innerHeight/2, 22);
    splash.classList.add('opening');
    setTimeout(()=>{
      splash.style.display='none';
      main.classList.remove('hidden');
      nav.classList.remove('hidden');
      nav.classList.add('visible');
      document.body.style.overflow='';
      initCountdown();
      initReveal();
      initParallax();
    }, 1060);
  }
})();

/* ══ COUNTDOWN ══ */
function initCountdown(){
  const slots = ['cd-days','cd-hours','cd-minutes','cd-seconds'];
  const prev  = [null,null,null,null];
  function getVals(){
    const d = WEDDING - new Date();
    if(d<=0) return [0,0,0,0];
    return[Math.floor(d/86400000),Math.floor((d%86400000)/3600000),Math.floor((d%3600000)/60000),Math.floor((d%60000)/1000)];
  }
  function pad(n){return String(n).padStart(2,'0')}
  function anim(trackEl, val){
    const ex = trackEl.querySelector('.cds-exit');
    if(ex) ex.remove();
    const cur = trackEl.querySelector('.cd-slide:not(.cds-exit)');
    if(cur){cur.classList.add('cds-exit');setTimeout(()=>cur.remove(),450)}
    const next = document.createElement('div');
    next.className='cd-slide cds-enter';
    next.textContent=pad(val);
    trackEl.appendChild(next);
  }
  function tick(){
    const v=getVals();
    v.forEach((val,i)=>{
      if(val!==prev[i]){
        const t=document.getElementById(slots[i]);
        if(t) anim(t,val);
        prev[i]=val;
      }
    });
  }
  tick(); setInterval(tick,1000);
}

/* ══ PARALLAX RING — disappears into next section ══ */
function initParallax(){
  const ring = document.getElementById('ring-wrap');
  if(!ring) return;
  const hero = document.querySelector('.hero-sec');
  window.addEventListener('scroll',()=>{
    const scrollY = window.scrollY;
    const heroH   = hero ? hero.offsetHeight : window.innerHeight;
    // Move down with scroll
    ring.style.transform = `translateY(${scrollY * 0.22}px)`;
    // Fade out as we approach the next section
    const progress = scrollY / (heroH * 0.6);
    ring.style.opacity = Math.max(0, 1 - progress);
  },{passive:true});
}

/* ══ SCROLL REVEAL ══ */
function initReveal(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in-view'),60);obs.unobserve(e.target)}
    });
  },{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* ══ PARTICLES — buttons only ══ */
const canvas = document.getElementById('pc');
const ctx = canvas ? canvas.getContext('2d') : null;
const PX = [];
if(canvas){
  function rsz(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
  rsz(); window.addEventListener('resize',rsz); loop();
}
function spawnParticles(x,y,count=14){
  const C=['#C9A86A','#B8963A','#E8D5A3','#7A1530','#F5ECD7','#fff'];
  const S=['heart','star','circle'];
  for(let i=0;i<count;i++){
    const a=(Math.PI*2*i)/count+Math.random()*.5;
    const sp=2.5+Math.random()*4.5;
    PX.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2.5,size:5+Math.random()*9,color:C[~~(Math.random()*C.length)],shape:S[~~(Math.random()*S.length)],spin:(Math.random()-.5)*.18,rot:Math.random()*Math.PI*2,life:1});
  }
}
function loop(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=PX.length-1;i>=0;i--){
    const p=PX[i];
    p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.vx*=.985;p.life-=.016;p.rot+=p.spin;
    if(p.life<=0){PX.splice(i,1);continue}
    ctx.save();ctx.globalAlpha=p.life;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;
    if(p.shape==='heart'){
      ctx.beginPath();ctx.moveTo(0,p.size*.3);
      ctx.bezierCurveTo(0,0,-p.size,0,-p.size,p.size*.4);
      ctx.bezierCurveTo(-p.size,p.size*.85,0,p.size*1.1,0,p.size*1.4);
      ctx.bezierCurveTo(0,p.size*1.1,p.size,p.size*.85,p.size,p.size*.4);
      ctx.bezierCurveTo(p.size,0,0,0,0,p.size*.3);ctx.fill();
    } else if(p.shape==='star'){
      ctx.beginPath();
      for(let s=0;s<5;s++){const a1=(s*4*Math.PI)/5-Math.PI/2,a2=((s*4+2)*Math.PI)/5-Math.PI/2;if(s===0)ctx.moveTo(Math.cos(a1)*p.size,Math.sin(a1)*p.size);else ctx.lineTo(Math.cos(a1)*p.size,Math.sin(a1)*p.size);ctx.lineTo(Math.cos(a2)*p.size*.42,Math.sin(a2)*p.size*.42)}
      ctx.closePath();ctx.fill();
    } else {ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  }
  requestAnimationFrame(loop);
}

/* Attach particles to buttons */
function attachP(sel){
  document.querySelectorAll(sel).forEach(el=>{
    el.addEventListener('click',e=>{
      const r=el.getBoundingClientRect();
      spawnParticles(r.left+r.width/2,r.top+r.height/2);
    });
  });
}

/* ══ NAVBAR ══ */
document.getElementById('nav-voeux')?.addEventListener('click',()=>{ document.getElementById('modal-voeux')?.classList.remove('hidden'); });
document.getElementById('nav-agenda')?.addEventListener('click',()=>{
  const t=encodeURIComponent('Mariage Ahmad & Samara');
  const l=encodeURIComponent('Salle Benkoli, Naqaus, Batna, Algérie');
  window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${t}&dates=20260816T173000/20260817T020000&location=${l}`,'_blank','noopener');
});
document.getElementById('nav-contact')?.addEventListener('click',()=>{ document.getElementById('modal-contact')?.classList.remove('hidden'); });
document.getElementById('nav-lieu')?.addEventListener('click',()=>{ window.open('https://maps.app.goo.gl/QZKrBppcyYgTwopr8','_blank','noopener'); });

/* Voeux send */
document.getElementById('send-voeux')?.addEventListener('click',()=>{
  const txt=document.getElementById('voeux-txt')?.value.trim();
  if(!txt) return;
  document.getElementById('voeux-sent')?.classList.remove('hidden');
  const b=document.getElementById('send-voeux');b.disabled=true;b.textContent='✦ Envoyé';
});

/* Close modals */
document.querySelectorAll('.mc').forEach(b=>b.addEventListener('click',()=>b.closest('.modal-ov').classList.add('hidden')));
document.querySelectorAll('.modal-ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.add('hidden')}));

/* RSVP */
document.getElementById('rsvp-btn')?.addEventListener('click',()=>{
  const name=document.getElementById('rsvp-name')?.value.trim();
  const att=document.getElementById('rsvp-att')?.value;
  if(!name||!att){alert('Veuillez remplir tous les champs.');return}
  document.getElementById('rsvp-ok')?.classList.remove('hidden');
});

/* Attach particles after DOM is ready */
document.addEventListener('DOMContentLoaded',()=>{
  attachP('.ni,.btn-map,.mbtn,.rsvp-magic-btn,.clink,#send-voeux');
});
