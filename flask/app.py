from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

# PostgreSQL bağlantı ayarları
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:aosm@localhost:5432/diet_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Ana sayfa
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Form verilerini al
        symptom = request.form.get("symptom")
        meal = request.form.get("meal")
        water_intake = request.form.get("water_intake")
        weight = request.form.get("weight")

        # Yemek ve semptom ekleme
        if meal:
            sql_meal = text("INSERT INTO MealLog (Meal, Symptom) VALUES (:meal, :symptom)")
            db.session.execute(sql_meal, {"meal": meal, "symptom": symptom})
        
        # Su tüketimi ekleme
        if water_intake:
            sql_water = text("INSERT INTO WaterLog (Intake) VALUES (:water_intake)")
            db.session.execute(sql_water, {"water_intake": float(water_intake)})

        # Kilo ekleme
        if weight:
            sql_weight = text("INSERT INTO WeightLog (Weight) VALUES (:weight)")
            db.session.execute(sql_weight, {"weight": float(weight)})

        # Veritabanını kaydet
        db.session.commit()
        return redirect(url_for("index"))

    # SQL ile kayıtlı verileri sorgulama
    meal_query = text("SELECT Meal, Symptom FROM MealLog ORDER BY ID DESC")
    meals = db.session.execute(meal_query).fetchall()

    water_query = text("SELECT Intake FROM WaterLog ORDER BY ID DESC")
    water_logs = db.session.execute(water_query).fetchall()

    weight_query = text("SELECT Weight FROM WeightLog ORDER BY ID DESC")
    weights = db.session.execute(weight_query).fetchall()

    return render_template("index.html", meals=meals, water_logs=water_logs, weights=weights)

if __name__ == "__main__":
    app.run(debug=True)
