const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config"); // config.js'den bağlantıyı çekiyoruz
const User = require("./models/User"); // User modeli
const Meal = require("./models/Meal"); // Meal modeli

const app = express();
app.use(bodyParser.json());

// Veritabanı Senkronizasyonu
sequelize
  .sync()
  .then(() => console.log("Veritabanı senkronizasyonu başarılı."))
  .catch((err) => console.error("Veritabanı senkronizasyon hatası:", err));

// CRUD - Kullanıcılar
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcılar alınırken hata oluştu" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı eklenirken hata oluştu" });
  }
});

// CRUD - Öğünler
app.get("/meals", async (req, res) => {
  try {
    const meals = await Meal.findAll();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Öğünler alınırken hata oluştu" });
  }
});

app.post("/meals", async (req, res) => {
  try {
    const newMeal = await Meal.create(req.body);
    res.status(201).json(newMeal);
  } catch (err) {
    res.status(500).json({ error: "Öğün eklenirken hata oluştu" });
  }
});

// Sunucu Dinleme
app.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor...");
});
