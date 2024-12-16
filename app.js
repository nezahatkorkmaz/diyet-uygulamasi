const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config");
const User = require("./models/User");
const Meal = require("./models/Meal");

const app = express();
app.use(bodyParser.json());

// Veritabanı senkronizasyonu
sequelize
  .sync()
  .then(() => console.log("Veritabanı senkronizasyonu başarılı"))
  .catch((err) => console.error("Veritabanı hatası:", err));

// Kullanıcılar için CRUD işlemleri
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

// Öğünler için CRUD işlemleri
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

module.exports = app;
