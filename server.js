const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// SQLite database path
const dbPath = path.join(dataDir, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err)=> {
  if(err) {
    console.error('Failed to open DB', err);
    process.exit(1);
  }
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    name TEXT,
    phone TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS sleep_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    hours REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Helper DB functions
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
  });
}
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  });
}
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { err ? reject(err) : resolve(this); });
  });
}

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Seed admin user if not exists
(async function seedAdmin(){
  try {
    const adminUser = await dbGet("SELECT * FROM users WHERE username = ?", ['altingozluadam']);
    if(!adminUser){
      const plain = 'Has58';
      const hash = await bcrypt.hash(plain, 10);
      await dbRun("INSERT INTO users (username, name, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        ['altingozluadam', 'Altın Gözlü Adam', null, hash, 'admin']);
      console.log('Admin user seeded: username=altingozluadam password=Has58');
    } else {
      // do nothing
      console.log('Admin user exists');
    }
  } catch(err){
    console.error('Error seeding admin', err);
  }
})();

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, password, username } = req.body;
  if(!name || !phone || !password) return res.json({ ok:false, message:'Eksik alan' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await dbRun("INSERT INTO users (username, name, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [username || null, name, phone, hash, 'user']);
    const user = await dbGet("SELECT id, username, name, phone, role FROM users WHERE phone = ?", [phone]);
    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.json({ ok: false, message: err.message });
  }
});

// Login (supports username or phone)
app.post('/api/auth/login', async (req, res) => {
  const { username, phone, password } = req.body;
  try {
    let user = null;
    if(username){
      user = await dbGet("SELECT * FROM users WHERE username = ?", [username]);
    } else if(phone){
      user = await dbGet("SELECT * FROM users WHERE phone = ?", [phone]);
    } else {
      return res.json({ ok:false, message:'username veya phone gerekli' });
    }
    if(!user) return res.json({ ok:false, message:'Kullanıcı bulunamadı' });
    const match = await bcrypt.compare(password, user.password || '');
    if(!match) return res.json({ ok:false, message:'Şifre hatalı' });
    // return safe user
    const safe = { id: user.id, username: user.username, name: user.name, phone: user.phone, role: user.role };
    res.json({ ok:true, user: safe });
  } catch(err){
    console.error(err);
    res.json({ ok:false, message: 'Sunucu hatası' });
  }
});

// Sleep records endpoints
app.post('/api/sleep-records', async (req, res) => {
  const { user_id, date, hours } = req.body;
  try {
    await dbRun("INSERT INTO sleep_records (user_id, date, hours) VALUES (?, ?, ?)", [user_id, date, hours]);
    res.json({ ok: true });
  } catch(err){
    console.error(err);
    res.json({ ok:false, message: err.message });
  }
});

app.get('/api/sleep-records', async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM sleep_records");
    res.json({ ok: true, records: rows });
  } catch(err){
    console.error(err);
    res.json({ ok:false, message: err.message });
  }
});

app.listen(port, () => console.log('Server started on port', port));
