const express = require('express');
const path = require('path');
const cors = require('cors'); // CORS hatalarını önlemek için
const app = express();

// Middleware
app.use(cors()); // React uygulamasıyla iletişim için CORS ayarı
app.use(express.json()); // JSON verilerini almak için
app.use(express.urlencoded({ extended: true })); // URL-encoded verileri almak için

// Static dosyaları servis et (React frontend dahil)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', require('./app')); // API'yi app.js'den alıyoruz

// React frontend için wildcard route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
