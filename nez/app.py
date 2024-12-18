from flask import Flask, render_template, request, redirect, url_for
from models import db, User, Meal, Symptom, Category

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:yeni_sifre@localhost:5432/diyet_uygulamasi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Ana Sayfa
@app.route('/')
def index():
    return render_template('index.html')

# Meals Sayfası: Yemek Listeleme ve Ekleme
@app.route('/meals', methods=['GET', 'POST'])
def meals():
    if request.method == 'POST':
        meal_name = request.form['meal_name']
        new_meal = Meal(meal_name=meal_name)
        db.session.add(new_meal)
        db.session.commit()
        return redirect(url_for('meals'))
    meals = Meal.query.all()
    return render_template('meals.html', meals=meals)

# Semptomlar Sayfası
@app.route('/symptoms', methods=['GET', 'POST'])
def symptoms():
    if request.method == 'POST':
        meal_name = request.form['meal_name']
        new_meal = Meal(meal_name=meal_name)
        db.session.add(new_meal)
        db.session.commit()
        return redirect(url_for('symptoms'))

    # Semptomları categories tablosuyla birleştir
    symptoms = db.session.query(Symptom, Category.category_name) \
                         .join(Category, Symptom.category_id == Category.category_id).all()
    meals = Meal.query.all()

    # Template için düzenle
    symptoms_list = [
        {"symptom_name": symptom.symptom_name, "category": category_name}
        for symptom, category_name in symptoms
    ]
    return render_template('symptoms.html', symptoms=symptoms_list, meals=meals)

# Kullanıcılar Sayfası: Kullanıcıları Listeleme
@app.route('/users')
def users():
    users = User.query.all()
    return render_template('users.html', users=users)

# Yemek Ekleme API
@app.route('/add-meal', methods=['POST'])
def add_meal():
    meal_name = request.form['meal_name']
    new_meal = Meal(meal_name=meal_name)
    db.session.add(new_meal)
    db.session.commit()
    return redirect(url_for('symptoms'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
