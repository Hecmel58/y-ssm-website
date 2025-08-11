const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const usersFile = path.join(dataDir, 'users.json');
const recordsFile = path.join(dataDir, 'sleep_records.json');

function readJSON(f, def){ try{ if(!fs.existsSync(f)) return def; return JSON.parse(fs.readFileSync(f)); } catch(e){ return def; } }
function writeJSON(f, obj){ fs.writeFileSync(f, JSON.stringify(obj, null, 2)); }

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

if(!fs.existsSync(usersFile)) writeJSON(usersFile, [{id:'admin', username:'admin', password:'admin', role:'admin', name:'Admin'}]);

// simple auth endpoints (demo only - not production secure)
app.post('/api/auth/login', (req,res)=>{
  const { username, password } = req.body || {};
  const users = readJSON(usersFile, []);
  const u = users.find(x=>x.username===username && x.password===password);
  if(!u) return res.json({ ok:false, message:'Kullanıcı bulunamadı veya şifre hatalı' });
  const safe = { id:u.id, username:u.username, name:u.name, role:u.role };
  return res.json({ ok:true, user: safe });
});

app.post('/api/auth/register', (req,res)=>{
  const { username, password, name } = req.body || {};
  if(!username || !password) return res.json({ ok:false, message:'Eksik alan' });
  const users = readJSON(usersFile, []);
  if(users.find(u=>u.username===username)) return res.json({ ok:false, message:'Kullanıcı hali hazırda var' });
  const id = 'u'+(users.length+1);
  users.push({ id, username, password, name, role:'user' });
  writeJSON(usersFile, users);
  res.json({ ok:true, user: { id, username, name, role:'user' } });
});

// sleep records
app.get('/api/sleep-records', (req,res)=>{
  const q = req.query || {};
  const all = readJSON(recordsFile, []);
  let filtered = all;
  if(q.userId) filtered = filtered.filter(r=>r.userId==q.userId);
  if(q.start) filtered = filtered.filter(r=>r.date>=q.start);
  if(q.end) filtered = filtered.filter(r=>r.date<=q.end);
  // simple range presets
  if(q.range==='weekly'){
    const now = new Date(); const last = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
    filtered = filtered.filter(r=> new Date(r.date) >= last );
  } else if(q.range==='monthly'){
    const now = new Date(); const last = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
    filtered = filtered.filter(r=> new Date(r.date) >= last );
  }
  // return sorted by date
  filtered.sort((a,b)=> a.date.localeCompare(b.date));
  res.json({ ok:true, records: filtered });
});

app.post('/api/sleep-records', (req,res)=>{
  const body = req.body || {};
  if(!body.date) return res.json({ ok:false, message:'Tarih gerekli' });
  const all = readJSON(recordsFile, []);
  const rec = {
    id: 'r'+(all.length+1),
    userId: body.userId || 'guest',
    date: body.date,
    deep: Number(body.deep)||0,
    light: Number(body.light)||0,
    rem: Number(body.rem)||0,
    avgHr: Number(body.avgHr)||0,
    createdAt: new Date().toISOString()
  };
  all.push(rec); writeJSON(recordsFile, all);
  res.json({ ok:true, record: rec });
});

app.listen(port, ()=> console.log('Server started on', port));
