from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:yeni_sifre@localhost/diyet-uygulamasi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modeller
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    role = db.Column(db.String(20))

class Meal(db.Model):
    __tablename__ = 'meals'
    meal_id = db.Column(db.Integer, primary_key=True)
    meal_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"user_id": u.user_id, "name": f"{u.first_name} {u.last_name}", "role": u.role} for u in users])

@app.route('/api/meals', methods=['GET', 'POST'])
def meals():
    if request.method == 'GET':
        meals = Meal.query.all()
        return jsonify([{"meal_id": m.meal_id, "name": m.meal_name} for m in meals])
    elif request.method == 'POST':
        data = request.json
        new_meal = Meal(meal_name=data['name'])
        db.session.add(new_meal)
        db.session.commit()
        return jsonify({"message": "Meal added successfully"}), 201

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
