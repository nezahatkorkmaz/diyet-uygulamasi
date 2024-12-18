-- Kullanıcı Tablosu (Admin ve Kullanıcı Rolleri)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Semptomların Tanımlandığı Tablo
CREATE TABLE IF NOT EXISTS symptoms (
    symptom_id SERIAL PRIMARY KEY,
    symptom_name VARCHAR(255) UNIQUE NOT NULL
);

-- Kullanıcının Günlük Semptomlarını Kaydeden Tablo
CREATE TABLE IF NOT EXISTS daily_symptoms (
    daily_symptom_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    symptom_id INT REFERENCES symptoms(symptom_id) ON DELETE CASCADE,
    logged_at DATE DEFAULT CURRENT_DATE
);

-- Öğün Tablosu
CREATE TABLE IF NOT EXISTS meals (
    meal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    meal_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Öğün Günlükleri Tablosu
CREATE TABLE IF NOT EXISTS meal_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    meal_id INT REFERENCES meals(meal_id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    symptoms VARCHAR(255) DEFAULT NULL
);

-- Su Tüketimi Tablosu
CREATE TABLE IF NOT EXISTS water_logs (
    water_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    log_date DATE NOT NULL
);

-- Ağırlık Takibi Tablosu
CREATE TABLE IF NOT EXISTS weight_logs (
    weight_log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    weight FLOAT NOT NULL,
    log_date DATE NOT NULL
);

-- Tarifler Tablosu
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- Kullanıcıya Rekomendasyonlar İçin Tablo
CREATE TABLE IF NOT EXISTS recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Yetkilendirme Trigger: Sadece Adminler Meals Ekleyebilir
CREATE OR REPLACE FUNCTION check_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT role FROM users WHERE user_id = NEW.user_id) != 'admin' THEN
        RAISE EXCEPTION 'Yalnızca admin kullanıcıları yeni öğün ekleyebilir.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_admin_meals
BEFORE INSERT ON meals
FOR EACH ROW
EXECUTE FUNCTION check_admin_role();

-- Admin Kullanıcıların Tüm Kullanıcı Bilgilerini Görebileceği VIEW
CREATE OR REPLACE VIEW admin_user_view AS
SELECT 
    user_id,
    first_name,
    last_name,
    email,
    role,
    created_at
FROM users;

-- Indexleme: Performans Optimizasyonu İçin
CREATE INDEX IF NOT EXISTS idx_user_id_daily_symptoms ON daily_symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_user_id_meal_logs ON meal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_log_date_meal_logs ON meal_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_user_id_meals ON meals(user_id);

-- Stored Procedures ve Functions

-- Günlük Semptom Ekleme
CREATE OR REPLACE PROCEDURE add_daily_symptoms(p_user_id INT, p_symptom_ids INT[])
LANGUAGE plpgsql
AS $$
DECLARE
    symptom_id INT;
BEGIN
    FOREACH symptom_id IN ARRAY p_symptom_ids LOOP
        INSERT INTO daily_symptoms (user_id, symptom_id, logged_at)
        VALUES (p_user_id, symptom_id, CURRENT_DATE)
        ON CONFLICT DO NOTHING;
    END LOOP;
    RAISE NOTICE 'Günlük semptomlar başarıyla eklendi!';
END;
$$;

-- Günlük Semptomları Listeleme
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

-- Problemli Besinleri Tespit Eden Trigger ve Function
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

CREATE OR REPLACE TRIGGER check_problematic_foods
AFTER INSERT ON meal_logs
FOR EACH ROW
EXECUTE FUNCTION detect_problematic_foods();

INSERT INTO symptoms (symptom_name, category_id) VALUES
-- Sindirim Sistemi (category_id = 1)
('Şişkinlik', 1),
('Karın Ağrısı', 1),
('Gaz', 1),
('İshal', 1),
('Kabızlık', 1),
('Mide Bulantısı', 1),
('Reflü veya Hazımsızlık', 1),

-- Sinir Sistemi (category_id = 2)
('Baş Ağrısı', 2),
('Migren', 2),
('Halsizlik veya Yorgunluk', 2),
('Konsantrasyon Bozukluğu', 2),
('Sersemlik Hissi', 2),

-- Cilt Problemleri (category_id = 3)
('Kaşıntı', 3),
('Kızarıklık', 3),
('Egzama', 3),
('Kurdeşen', 3),
('Deride Şişlik', 3),

-- Solunum Sistemi (category_id = 4)
('Burun Akıntısı', 4),
('Hapşırma', 4),
('Nefes Darlığı', 4),
('Boğaz Kaşıntısı', 4),

-- Kas Problemleri (category_id = 5)
('Kas Ağrıları', 5),
('Kas Güçsüzlüğü', 5),

-- Diğer Semptomlar (category_id = 6)
('Kalp Çarpıntısı', 6),
('Uyku Bozuklukları', 6),
('Ağız veya Boğaz Şişmesi', 6),
('Kilo Artışı veya Kilo Kaybı', 6),
('Gözlerde Kaşıntı veya Kızarıklık', 6)
ON CONFLICT (symptom_name) DO NOTHING;


-- Örnek Recipe Verileri
INSERT INTO recipes (name, description, image_url) 
VALUES 
('Avocado Toast', 'Simple avocado toast with egg and tomato.', 'https://via.placeholder.com/150'),
('Oatmeal Bowl', 'Healthy oatmeal with fruits and nuts.', 'https://via.placeholder.com/150')
ON CONFLICT DO NOTHING;
