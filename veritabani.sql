-- Kullanıcı Tablosu
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Semptomlar
CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    meal_id INT REFERENCES meals(id),
    symptom_description TEXT,
    logged_at TIMESTAMP DEFAULT NOW()
);

-- Yemekler Tablosu
CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    meal_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Öğün Günlükleri Tablosu
CREATE TABLE meal_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    meal_id INT REFERENCES meals(meal_id),
    log_date DATE NOT NULL,
    symptoms VARCHAR(255) DEFAULT NULL
);

-- Su Tüketimi Tablosu
CREATE TABLE water_logs (
    water_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    amount FLOAT NOT NULL, -- Litre olarak
    log_date DATE NOT NULL
);

-- Ağırlık Takibi Tablosu
CREATE TABLE weight_logs (
    weight_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    weight FLOAT NOT NULL,
    log_date DATE NOT NULL
);

-- Problemli Besinleri Tespit Eden Trigger
CREATE OR REPLACE FUNCTION detect_problematic_foods()
RETURNS TRIGGER AS $$
BEGIN
    -- Semptom analizi için örnek bir işlem
    INSERT INTO recommendations (user_id, recommendation)
    SELECT ml.user_id, 'Muhtemelen problemli besin: ' || m.meal_name
    FROM meal_logs ml
    JOIN meals m ON ml.meal_id = m.meal_id
    WHERE ml.symptoms IS NOT NULL
    AND ml.log_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY ml.user_id, m.meal_name
    HAVING COUNT(ml.symptoms) > 2;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER symptom_trigger
AFTER INSERT ON meal_logs
FOR EACH ROW
EXECUTE FUNCTION detect_problematic_foods();
