// client app
const API = {
  login: (data)=> fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}).then(r=>r.json()),
  register: (data)=> fetch('/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}).then(r=>r.json()),
  getSleep: ()=> fetch('/api/sleep-records').then(r=>r.json())
};

function $(s){return document.querySelector(s);}
function $all(s){return Array.from(document.querySelectorAll(s));}

document.addEventListener('DOMContentLoaded', ()=>{
  const loginForm = $('#loginForm');
  const registerForm = $('#registerForm');
  const adminForm = $('#adminForm');
  $('#openRegisterBtn').addEventListener('click', ()=> openModal('#registerModal'));
  $('#openAdminBtn').addEventListener('click', ()=> openModal('#adminModal'));

  document.body.addEventListener('click',(e)=>{
    const c = e.target.closest('[data-close]');
    if(c){ closeModal(c.closest('.modal')); }
  });

  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const phone = $('#loginPhone').value.trim();
    const password = $('#loginPassword').value.trim();
    if(!phone || !password){ alert('Lütfen doldurun'); return; }
    const res = await API.login({phone,password});
    if(res.ok){ startApp(res.user); } else alert(res.message || 'Hata');
  });

  registerForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!$('#agreementCheckbox').checked){ alert('Sözleşmeyi onaylayın'); return; }
    const name = $('#registerName').value.trim();
    const phone = $('#registerPhone').value.trim();
    const password = $('#registerPassword').value.trim();
    const res = await API.register({name,phone,password});
    if(res.ok){ alert('Kayıt başarılı'); closeModal('#registerModal'); } else alert(res.message || 'Hata');
  });

  adminForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = $('#adminUsername').value.trim();
    const password = $('#adminPwd').value.trim();
    if(!username || !password){ alert('Lütfen doldurun'); return; }
    const res = await API.login({username,password});
    if(res.ok){ startApp(res.user); } else alert(res.message || 'Admin hatası');
  });
});

function openModal(sel){ const el = document.querySelector(sel); if(!el) return; el.style.display='flex'; el.classList.add('open'); el.setAttribute('aria-hidden','false'); }
function closeModal(el){ if(typeof el==='string') el=document.querySelector(el); if(!el) return; el.style.display='none'; el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }

async function startApp(user){
  // hide login, show main app
  $('#loginWrap').style.display='none';
  $('#mainApp').hidden = false;
  // load nav and modals from components
  const nav = await fetch('components/navigation.html').then(r=>r.text());
  $('#appNav').innerHTML = nav;
  bindNav();
  $('#appHeader').innerHTML = '<div class="brand">Y-SSM</div><div class="user">Hoşgeldiniz, '+(user.name||user.username||'Kullanıcı')+' <button id="logoutBtn" class="btn small">Çıkış</button></div>';
  $('#logoutBtn').addEventListener('click', ()=> { location.reload(); });
  // load modals
  const modals = await fetch('components/modals.html').then(r=>r.text());
  const div = document.createElement('div'); div.innerHTML = modals; document.body.appendChild(div);
  // create sections
  createSections(['dashboard','relaxation','binaural','records','support','profile','admin']);
  showSection('dashboard');
}

function bindNav(){
  document.querySelectorAll('[data-section]').forEach(btn=>{
    btn.addEventListener('click',(e)=>{ e.preventDefault(); const s=btn.getAttribute('data-section'); showSection(s); document.querySelectorAll('[data-section]').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); });
  });
}

function createSections(list){
  const content = $('#appContent');
  content.innerHTML = '';
  list.forEach(name=>{
    const s = document.createElement('section');
    s.id = 'section-'+name; s.className='app-section'; s.style.display='none';
    s.innerHTML = '<h2>'+name.toUpperCase()+'</h2><div class="section-body">İçerik yok.</div>';
    content.appendChild(s);
  });
}

function showSection(name){
  $all('.app-section').forEach(s=>s.style.display='none');
  const sel = $('#section-'+name);
  if(!sel) return;
  sel.style.display='block';
  // try load page
  fetch('pages/'+name+'.html').then(r=>{ if(!r.ok) throw new Error('no'); return r.text(); }).then(html=>{ sel.querySelector('.section-body').innerHTML = html; }).catch(()=>{ /* ignore */ });
}
