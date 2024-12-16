from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class MealLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    meal = db.Column(db.String(100), nullable=False)
    symptom = db.Column(db.String(200), nullable=True)

class WaterLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    intake = db.Column(db.Float, nullable=False)

class WeightLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    weight = db.Column(db.Float, nullable=False)
