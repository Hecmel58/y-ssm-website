import { drawDonutChart, drawLineChart, drawBarChart } from './charts.js';
import { Auth } from './auth.js';

const auth = new Auth();
const $ = sel => document.querySelector(sel);

function initTheme() {
  const btn = $('#themeToggle');
  btn.addEventListener('click', () => {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    btn.textContent = body.getAttribute('data-theme') === 'dark' ? '☾' : '☼';
  });
}

function initHeroBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 5;

  const geometry = new THREE.SphereGeometry(0.08, 8, 8);
  const material = new THREE.MeshBasicMaterial({color:0x667eea, transparent:true, opacity:0.6});
  const parts = [];
  for(let i=0;i<60;i++){const p=new THREE.Mesh(geometry,material);p.position.set((Math.random()-0.5)*12,(Math.random()-0.5)*6,(Math.random()-0.5)*6);p.vel=new THREE.Vector3((Math.random()-0.5)*0.01,(Math.random()-0.5)*0.01,0);scene.add(p);parts.push(p)}
  function animate(){requestAnimationFrame(animate);parts.forEach(p=>{p.position.add(p.vel);if(Math.abs(p.position.x)>8)p.position.x*=-1;if(Math.abs(p.position.y)>6)p.position.y*=-1});renderer.render(scene,camera)}
  animate();
  window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)})
}

function createFloatingParticles(){
  const container = document.getElementById('particles');
  if(!container) return;
  for(let i=0;i<18;i++){const d=document.createElement('div');d.className='particle';d.style.left=Math.random()*100+'%';d.style.width=d.style.height=(Math.random()*10+6)+'px';d.style.top=Math.random()*100+'%';container.appendChild(d)}
}

function animateCounters(){
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(c=>{
    const target = +c.dataset.target || 0;let cur=0;const step=Math.max(1,Math.ceil(target/80));
    const run=()=>{cur+=step;c.textContent = cur>target?target:cur; if(cur<target) requestAnimationFrame(run)}; run();
  });
}

function initUI(){
  document.getElementById('openLogin').addEventListener('click', ()=>auth.showLogin());
  document.getElementById('openRegister').addEventListener('click', ()=>auth.showRegister());
}

function init(){
  initTheme();
  initHeroBackground();
  createFloatingParticles();
  animateCounters();
  initUI();
}

document.addEventListener('DOMContentLoaded', init);

if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').then(()=>console.log('sw registered')).catch(()=>console.log('sw failed'));}
