const express = require('express');
const path = require('path');
const cors = require('cors'); // CORS hatalarını önlemek için
const { Pool } = require('pg'); // PostgreSQL bağlantısı için
const app = express();

// Middleware
app.use(cors()); // React uygulamasıyla iletişim için CORS ayarı
app.use(express.json()); // JSON verilerini almak için
app.use(express.urlencoded({ extended: true })); // URL-encoded verileri almak için

// Static dosyaları servis et (React frontend dahil)
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL bağlantısı
const pool = new Pool({
  user: 'postgres',       // PostgreSQL kullanıcı adı
  host: 'localhost',      // Veritabanı sunucu adresi
  database: 'diyet_db',   // Veritabanı adı
  password: 'password',   // PostgreSQL şifre
  port: 5432,             // PostgreSQL portu
});

// API Routes
// Semptom Ekleme Endpoint'i
app.post('/api/symptoms', async (req, res) => {
  const { user_id, meal_id, symptom_description } = req.body;

  try {
    await pool.query(
      'INSERT INTO symptoms (user_id, meal_id, symptom_description) VALUES ($1, $2, $3)',
      [user_id, meal_id, symptom_description]
    );
    res.status(201).json({ message: 'Semptom başarıyla eklendi!' });
  } catch (err) {
    console.error('Semptom eklerken hata:', err.message);
    res.status(500).json({ error: 'Semptom eklenirken bir hata oluştu!' });
  }
});

// Yemek Ekleme Endpoint'i
app.post('/api/meals', async (req, res) => {
  const { meal_name, calories } = req.body;

  try {
    await pool.query(
      'INSERT INTO meals (meal_name, calories) VALUES ($1, $2)',
      [meal_name, calories]
    );
    res.status(201).json({ message: 'Yemek başarıyla eklendi!' });
  } catch (err) {
    console.error('Yemek eklerken hata:', err.message);
    res.status(500).json({ error: 'Yemek eklenirken bir hata oluştu!' });
  }
});

// React frontend için wildcard route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

app.post('/api/daily-symptoms', async (req, res) => {
  const { user_id, symptoms, logged_at } = req.body;

  try {
    for (const symptom of symptoms) {
      await pool.query(
        'INSERT INTO symptoms (user_id, symptom_description, logged_at) VALUES ($1, $2, $3)',
        [user_id, symptom, logged_at]
      );
    }
    res.status(201).json({ message: 'Bugünün semptomları başarıyla kaydedildi!' });
  } catch (err) {
    console.error('Semptom kaydı hatası:', err.message);
    res.status(500).json({ error: 'Semptomlar kaydedilirken bir hata oluştu.' });
  }
});
