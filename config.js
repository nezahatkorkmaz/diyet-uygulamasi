const { Sequelize } = require("sequelize");

// PostgreSQL bağlantı ayarları
const sequelize = new Sequelize("diyet-uygulamasi", "postgres", "yeni_sifre", {
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL veritabanına başarılı bir şekilde bağlanıldı.");
  })
  .catch((err) => {
    console.error("PostgreSQL bağlantı hatası:", err);
  });

module.exports = sequelize;
