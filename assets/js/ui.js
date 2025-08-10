
// ui.js - handles data-onclick delegation, modals, hamburger, audio/video controls
document.addEventListener('click', function(e){
  const el = e.target.closest('[data-onclick]');
  if(el){
    const code = el.getAttribute('data-onclick');
    try{ (new Function(code))(); } catch(err){ console.error('data-onclick error', err); }
  }
  // hamburger toggle
  if(e.target.closest('.hamburger')){
    const nav = document.querySelector('nav[role="navigation"] ul');
    if(nav) nav.classList.toggle('open');
  }
});

// close modal when clicking .close or overlay
document.addEventListener('click', function(e){
  if(e.target.classList && e.target.classList.contains('close')){
    const modal = e.target.closest('.modal');
    if(modal) modal.classList.remove('open');
  }
  if(e.target.classList && e.target.classList.contains('modal')){
    e.target.classList.remove('open');
  }
});

// keyboard accessibility for data-onclick elements and modals
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  }
  if(e.key === 'Enter' || e.key === ' '){
    const active = document.activeElement;
    if(active && active.hasAttribute('data-onclick')){
      const code = active.getAttribute('data-onclick');
      try{ (new Function(code))(); } catch(err){ console.error(err); }
    }
  }
});

// Audio player small enhancements
window.addEventListener('DOMContentLoaded', ()=>{
  const audio = document.getElementById('audioElement');
  if(audio){
    const title = document.getElementById('audioTitle');
    audio.addEventListener('play', ()=>{ title.textContent = 'Çalıyor...'; });
    audio.addEventListener('pause', ()=>{ title.textContent = 'Duraklatıldı'; });
    audio.addEventListener('ended', ()=>{ title.textContent = 'Bitti'; });
  }

  // Video fallback: if video source missing, show canvas fallback
  const video = document.getElementById('mainVideo');
  if(video){
    const sources = video.querySelectorAll('source');
    let hasSource = false;
    sources.forEach(s => { if(s.getAttribute('src')) hasSource = true; });
    if(!hasSource){
      video.style.display = 'none';
      document.getElementById('videoFallback').style.display = 'block';
      const canvas = document.getElementById('videoCanvas');
      const ctx = canvas.getContext('2d');
      let t=0;
      function draw(){
        ctx.fillStyle = '#0f1724';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#667eea';
        ctx.font = '30px sans-serif';
        ctx.fillText('Video önizlemesi yok - animasyon gösteriliyor',20,50);
        ctx.fillStyle = '#764ba2';
        for(let i=0;i<10;i++){
          ctx.beginPath();
          ctx.arc(320 + Math.sin(t+i)*100, 180 + Math.cos(t+i)*40, 20, 0, Math.PI*2);
          ctx.fill();
        }
        t += 0.02;
        requestAnimationFrame(draw);
      }
      draw();
      document.getElementById('vfPlay').addEventListener('click', ()=> alert('Bu bir demo fallback oynatıcıdır. Gerçek video dosyası ekleyin: assets/videos/sample.mp4'));
    }
  }
});
