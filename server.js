const express = require("express");
const path = require("path");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// PostgreSQL Veritabanı Bağlantısı
const sequelize = new Sequelize("diyet-uygulamasi", "postgres", "yeni_sifre", {
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => console.log("Veritabanı bağlantısı başarılı."))
  .catch((err) => console.error("Veritabanı bağlantı hatası:", err));

// Modeller
const User = sequelize.define("User", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Meal = sequelize.define("Meal", {
  mealName: { type: DataTypes.STRING, allowNull: false },
  calories: { type: DataTypes.FLOAT, allowNull: true },
});

const Recipe = sequelize.define("Recipe", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING },
});

const Symptom = sequelize.define("Symptom", {
  user_id: { type: DataTypes.INTEGER },
  symptom_description: { type: DataTypes.STRING },
  logged_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

// Sunucu Ayarları
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Public klasörünü statik servis et

// Veritabanı Senkronizasyonu
sequelize
  .sync()
  .then(() => console.log("Veritabanı senkronize edildi."))
  .catch((err) => console.error("Veritabanı senkronizasyon hatası:", err));

// API Endpoint'leri

// Semptom Ekle
app.post("/api/symptoms", async (req, res) => {
  const { userId, symptomDescription } = req.body;
  try {
    const symptom = await Symptom.create({
      user_id: userId,
      symptom_description: symptomDescription,
    });
    res.status(201).json(symptom);
  } catch (err) {
    console.error("Semptom eklerken hata:", err.message);
    res.status(500).json({ error: "Semptom eklenirken hata oluştu." });
  }
});

// Tarifleri Getir
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (err) {
    console.error("Tarifler çekilirken hata:", err.message);
    res.status(500).json({ error: "Tarifler çekilirken hata oluştu." });
  }
});

// Tarif Ekle (Opsiyonel)
app.post("/api/recipes", async (req, res) => {
  const { name, description, image_url } = req.body;
  try {
    const recipe = await Recipe.create({ name, description, image_url });
    res.status(201).json(recipe);
  } catch (err) {
    console.error("Tarif eklenirken hata:", err.message);
    res.status(500).json({ error: "Tarif eklenirken hata oluştu." });
  }
});

// recipes.html Sayfasını Servis Et
app.get("/recipes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "recipes.html"));
});

// Diğer Tüm İstekler: Frontend'e Yönlendirme
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Sunucu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
});
