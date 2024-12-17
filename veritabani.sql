-- Kullanıcı Tablosu (Admin ve Kullanıcı Rolleri)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')), -- Rol sütunu (admin, user)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Semptomların Tanımlandığı Tablo (Tüm Semptomlar Burada Tanımlı)
CREATE TABLE symptoms (
    symptom_id SERIAL PRIMARY KEY,
    symptom_name VARCHAR(255) UNIQUE NOT NULL
);

-- Kullanıcının Günlük Semptomlarını Kaydeden Tablo
CREATE TABLE daily_symptoms (
    daily_symptom_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    symptom_id INT REFERENCES symptoms(symptom_id) ON DELETE CASCADE,
    logged_at DATE DEFAULT CURRENT_DATE
);

-- Öğün Tablosu (Yemekler)
CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    meal_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Öğün Günlükleri Tablosu
CREATE TABLE meal_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    meal_id INT REFERENCES meals(meal_id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    symptoms VARCHAR(255) DEFAULT NULL
);

-- Su Tüketimi Tablosu
CREATE TABLE water_logs (
    water_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    amount FLOAT NOT NULL, -- Litre olarak
    log_date DATE NOT NULL
);

-- Ağırlık Takibi Tablosu
CREATE TABLE weight_logs (
    weight_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    weight FLOAT NOT NULL,
    log_date DATE NOT NULL
);

-- Recipes Tablosu
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- Örnek Veri: Recipes
INSERT INTO recipes (name, description, image_url) 
VALUES 
('Avocado Toast', 'Simple avocado toast with egg and tomato.', 'https://via.placeholder.com/150'),
('Oatmeal Bowl', 'Healthy oatmeal with fruits and nuts.', 'https://via.placeholder.com/150');

-- Kullanıcıya Rekomendasyonlar İçin Tablo
CREATE TABLE recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Yetkilendirme Trigger: Sadece Adminler Meals Ekleyebilir
CREATE OR REPLACE FUNCTION check_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Kullanıcı admin değilse işlem iptal edilir
    IF (SELECT role FROM users WHERE user_id = NEW.user_id) != 'admin' THEN
        RAISE EXCEPTION 'Yalnızca admin kullanıcıları yeni öğün ekleyebilir.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_admin_meals
BEFORE INSERT ON meals
FOR EACH ROW
EXECUTE FUNCTION check_admin_role();

-- Admin Kullanıcıların Tüm Kullanıcı Bilgilerini Görebileceği VIEW
CREATE VIEW admin_user_view AS
SELECT 
    user_id,
    first_name,
    last_name,
    email,
    role,
    created_at
FROM users
WHERE role = 'user' OR role = 'admin';

-- Indexleme: Performans İçin
CREATE INDEX idx_user_id_daily_symptoms ON daily_symptoms(user_id);
CREATE INDEX idx_user_id_meal_logs ON meal_logs(user_id);
CREATE INDEX idx_log_date_meal_logs ON meal_logs(log_date);
CREATE INDEX idx_user_id_meals ON meals(user_id);

-- Stored Procedures ve Functions

-- 1. Günlük Semptom Ekleme
CREATE OR REPLACE PROCEDURE add_daily_symptoms(p_user_id INT, p_symptom_ids INT[])
LANGUAGE plpgsql
AS $$
BEGIN
    FOREACH symptom_id IN ARRAY p_symptom_ids LOOP
        INSERT INTO daily_symptoms (user_id, symptom_id, logged_at)
        VALUES (p_user_id, symptom_id, CURRENT_DATE)
        ON CONFLICT DO NOTHING;
    END LOOP;
    RAISE NOTICE 'Günlük semptomlar başarıyla eklendi!';
END;
$$;

-- 2. Günlük Semptomları Listeleme
CREATE OR REPLACE FUNCTION get_daily_symptoms(p_user_id INT)
RETURNS TABLE(symptom_name VARCHAR, logged_at DATE)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT s.symptom_name, ds.logged_at
    FROM daily_symptoms ds
    JOIN symptoms s ON ds.symptom_id = s.symptom_id
    WHERE ds.user_id = p_user_id AND ds.logged_at = CURRENT_DATE;
END;
$$;

-- 3. Problemli Besinleri Tespit Eden Trigger ve Function
CREATE OR REPLACE FUNCTION detect_problematic_foods()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM meal_logs ml
        WHERE ml.user_id = NEW.user_id
          AND ml.symptoms IS NOT NULL
          AND ml.log_date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY ml.meal_id
        HAVING COUNT(ml.symptoms) > 2
    ) THEN
        INSERT INTO recommendations (user_id, recommendation)
        VALUES (NEW.user_id, 'Muhtemelen problemli bir yemek: ' || NEW.meal_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_problematic_foods
AFTER INSERT ON meal_logs
FOR EACH ROW
EXECUTE FUNCTION detect_problematic_foods();

-- Semptomlar Tablosuna Örnek Veriler Ekleyelim
INSERT INTO symptoms (symptom_name) VALUES 
('Şişkinlik'), ('Karın Ağrısı'), ('Gaz'), ('İshal'), 
('Kabızlık'), ('Mide Bulantısı'), ('Reflü'), ('Kaşıntı'), 
('Kızarıklık'), ('Egzama'), ('Baş Ağrısı'), ('Migren'),
('Halsizlik'), ('Konsantrasyon Bozukluğu'), ('Sersemlik Hissi'),
('Eklem Ağrıları'), ('Kas Ağrıları'), ('Kas Güçsüzlüğü'),
('Kalp Çarpıntısı'), ('Uyku Bozuklukları'), ('Ağız veya Boğaz Şişmesi'),
('Kilo Artışı veya Kilo Kaybı'), ('Gözlerde Kaşıntı veya Kızarıklık')
ON CONFLICT DO NOTHING;
