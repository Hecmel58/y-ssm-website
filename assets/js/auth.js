// Basit örnek auth modülü — gerçek projede backend ile entegre edin
export class Auth {
  constructor(){
    this.user = null;
    this.injectComponents();
    this.bindForms();
  }
  injectComponents(){
    const container = document.getElementById('components');
    // inject modals and navigation from components files
    // The build step already includes components/modals.html and components/navigation.html
    fetch('components/modals.html').then(r=>r.text()).then(t=>container.insertAdjacentHTML('beforeend', t));
    fetch('components/navigation.html').then(r=>r.text()).then(t=>container.insertAdjacentHTML('beforeend', t));
  }
  bindForms(){
    document.addEventListener('submit', e=>{
      if(e.target && e.target.matches('#loginForm')){e.preventDefault();this.login(new FormData(e.target))}
      if(e.target && e.target.matches('#registerForm')){e.preventDefault();this.register(new FormData(e.target))}
      if(e.target && e.target.matches('#sleepRecordForm')){e.preventDefault();this.saveSleepRecord(new FormData(e.target))}
    })
  }
  showLogin(){document.getElementById('loginModal')?.classList.add('open')}
  showRegister(){document.getElementById('registerModal')?.classList.add('open')}
  login(form){
    const phone = form.get('loginPhone') || '05550000000';
    // call backend
    fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({phone, password: form.get('loginPassword')})})
      .then(r=>r.json()).then(data=>{ if(data.ok){ this.user=data.user; this.onLogin(); } else { this.showNotification('Giriş başarısız') } })
      .catch(()=>this.showNotification('Sunucu hatası','error'))
  }
  register(form){
    const payload = Object.fromEntries(form.entries());
    fetch('/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})
      .then(r=>r.json()).then(data=>{ if(data.ok){ this.showNotification('Kayıt başarılı, giriş yapabilirsiniz.'); } })
  }
  saveSleepRecord(form){
    const payload = Object.fromEntries(form.entries());
    fetch('/api/sleep-records',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})
      .then(r=>r.json()).then(()=>this.showNotification('Kayıt kaydedildi'))
  }
  logout(){this.user=null;this.showNotification('Çıkış yapıldı')}
  onLogin(){
    document.getElementById('dashboard').hidden=false;document.getElementById('hero').hidden=true;this.showNotification('Giriş başarılı')
  }
  showNotification(msg){const n=document.getElementById('notification');document.getElementById('notificationText').textContent=msg;n.style.display='block';setTimeout(()=>n.style.display='none',2500)}
}
