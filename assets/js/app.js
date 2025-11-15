// app.js — theme, particles, tilt, verse widget, AI chat UI wiring
function themeController(){
  return {
    theme: localStorage.getItem('site-theme') || 'dark',
    skills: [
      { name: 'Angular', value: 90 },
      { name: 'React', value: 85 },
      { name: 'Java / Spring', value: 80 },
      { name: 'Testing', value: 78 },
      { name: 'DevOps', value: 70 }
    ],
    toggleTheme(){
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('site-theme', this.theme);
      document.documentElement.setAttribute('data-theme', this.theme);
    }
  }
}

// loader fade
document.addEventListener('DOMContentLoaded', ()=> {
  setTimeout(()=> {
    const L = document.getElementById('loader');
    if(L){ L.style.transition='opacity .5s'; L.style.opacity='0'; setTimeout(()=>L.remove(),600); }
  }, 900);
  initParticles();
  initTilt();
  initChat();
});

// Verse widget (fallback local list)
function verseWidget(){
  return {
    verse: 'Loading...',
    meaning: '',
    async loadVerse(force=false){
      // try fetch from /smbg/api if available
      try {
        // example: try to fetch from your smbg site if you had an API; fallback quickly
        const resp = await fetch('https://sameer05515.github.io/smbg/api/verse-of-day.json').catch(()=>null);
        if(resp && resp.ok){
          const j = await resp.json();
          this.verse = j.verse || j.text || '—';
          this.meaning = j.meaning || '';
          return;
        }
      } catch(e){ /* ignore */ }

      // fallback static
      const local = [
        {v: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', m: 'You have right to work only, not to its fruits.'},
        {v: 'योगः कर्मसु कौशलम्', m: 'Yoga is excellence in action.'},
        {v: 'यदा संहरते चायं', m: 'When one restrains the senses...'}
      ];
      const pick = local[Math.floor(Math.random()*local.length)];
      this.verse = pick.v; this.meaning = pick.m;
    }
  };
}

// Simple particle background
function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  for(let i=0;i<60;i++){
    particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+0.6,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,alpha:Math.random()*0.6+0.2});
  }
  function onResize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight; }
  addEventListener('resize', onResize);
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x>w) p.x=0; if(p.x<0) p.x=w;
      if(p.y>h) p.y=0; if(p.y<0) p.y=h;
      ctx.beginPath();
      ctx.fillStyle = "rgba(124,92,255,"+p.alpha+")";
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// 3D tilt on .tilt-card
function initTilt(){
  document.querySelectorAll('.tilt-card').forEach(el=>{
    el.addEventListener('mousemove', (e)=>{
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * -8;
      const ry = (x - 0.5) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      el.style.transition = 'transform 0.08s';
    });
    el.addEventListener('mouseleave', ()=> {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s ease';
    });
  });
}

// AI Chat UI wiring (UI only, sends to /api/ai if available)
function initChat(){
  const send = document.getElementById('sendChat');
  if(!send) return;
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');

  function append(cls, text){
    const d = document.createElement('div');
    d.className = cls + ' p-2 rounded mb-2';
    d.textContent = text;
    messages.appendChild(d);
    messages.scrollTop = messages.scrollHeight;
  }

  send.addEventListener('click', async ()=>{
    const q = input.value.trim(); if(!q) return;
    append('text-slate-300 bg-white/5', 'You: ' + q);
    input.value = '';
    append('text-slate-200 bg-white/3', 'Assistant: Thinking...');
    // post to /api/ai (not provided). If you have serverless endpoint, set url here.
    try {
      const res = await fetch('/api/ai', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({q})});
      if(!res.ok) throw new Error('No AI endpoint');
      const j = await res.json();
      messages.lastChild.textContent = 'Assistant: ' + (j.answer || JSON.stringify(j));
    } catch(e){
      messages.lastChild.textContent = 'Assistant: (no backend) — configure /api/ai to enable LLM responses';
    }
  });

  // also respond to Enter
  input.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter'){ ev.preventDefault(); send.click(); }
  });
}
