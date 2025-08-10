const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// SQLite database path
const dbPath = path.join(dataDir, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS sleep_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    hours REAL
  )`);
});

// Helper DB functions
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
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

// Kullanıcı kayıt
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    await dbRun("INSERT INTO users (name, phone, password) VALUES (?, ?, ?)", [name, phone, password]);
    const user = await dbAll("SELECT id, name, phone FROM users WHERE phone = ?", [phone]);
    res.json({ ok: true, user: user[0] });
  } catch (err) {
    res.json({ ok: false, message: err.message });
  }
});

// Kullanıcı giriş
app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = await dbAll("SELECT id, name, phone FROM users WHERE phone = ? AND password = ?", [phone, password]);
  if (user.length) {
    return res.json({ ok: true, user: user[0] });
  }
  return res.json({ ok: false, message: 'Kullanıcı bulunamadı veya şifre hatalı' });
});

// Uyku kayıt ekleme
app.post('/api/sleep-records', async (req, res) => {
  const { user_id, date, hours } = req.body;
  await dbRun("INSERT INTO sleep_records (user_id, date, hours) VALUES (?, ?, ?)", [user_id, date, hours]);
  res.json({ ok: true });
});

// Uyku kayıtlarını listeleme
app.get('/api/sleep-records', async (req, res) => {
  const rows = await dbAll("SELECT * FROM sleep_records");
  res.json({ ok: true, records: rows });
});

app.listen(port, () => console.log('Server started on port', port));
