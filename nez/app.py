from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Meal, Symptom  # models.py aynı klasörde

app = Flask(__name__)
CORS(app)  # API isteklerini destekle
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:yeni_sifre@localhost/diyet_uygulamasi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/meals')
def meals():
    return render_template('meals.html')

@app.route('/symptoms')
def symptoms():
    return render_template('symptoms.html')

@app.route('/users')
def users():
    return render_template('users.html')

if __name__ == '__main__':
    app.run(debug=True)
