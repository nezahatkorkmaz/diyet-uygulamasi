const express = require('express');
const path = require('path');
const app = express();

// Body parser middleware
app.use(express.json());  // JSON verilerini almak için

// Static dosyaları servis et (CSS ve JS dahil)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', require('./app'));  // API'yi app.js'den alıyoruz

// Ana sayfa için route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
