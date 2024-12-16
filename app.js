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

app.post('/symptoms', async (req, res) => {
  try {
      const { userId, mealId, symptomDescription } = req.body;
      const symptom = await Symptom.create({
          user_id: userId,
          meal_id: mealId,
          symptom_description: symptomDescription,
      });
      res.status(201).json(symptom);
  } catch (err) {
      res.status(500).json({ error: 'Semptom eklenirken hata oluştu.' });
  }
});

app.get('/symptoms', async (req, res) => {
  try {
      const { userId, filter } = req.query;
      const symptoms = await Symptom.findAll({
          where: {
              user_id: userId,
              symptom_description: { [Op.iLike]: `%${filter}%` },
          },
          include: Meal,
      });
      res.json(symptoms);
  } catch (err) {
      res.status(500).json({ error: 'Semptomlar alınırken hata oluştu.' });
  }
});
