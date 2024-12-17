// Symptom Filter Functionality
function filterSymptoms() {
  const selectedSymptom = document.getElementById("symptom-select").value;
  const filteredMeals = document.getElementById("filtered-meals");

  const meals = [
    { name: "Grilled Chicken", symptom: "bloating" },
    { name: "Salad", symptom: "headache" },
    { name: "Pasta", symptom: "fatigue" },
  ];

  const filtered = meals.filter(meal => meal.symptom === selectedSymptom || selectedSymptom === "none");

  filteredMeals.innerHTML = '';
  filtered.forEach(meal => {
    const mealDiv = document.createElement("div");
    mealDiv.textContent = meal.name;
    filteredMeals.appendChild(mealDiv);
  });
}

// Weight Tracker
const decreaseWeight = document.getElementById("decrease-weight");
const increaseWeight = document.getElementById("increase-weight");
const weightValue = document.getElementById("weight-value");
const kgButton = document.getElementById("kg");
const lbButton = document.getElementById("lb");

let weight = 64.0; // Başlangıç kilosu
let unit = "KG";   // Varsayılan birim

function updateWeight() {
  weightValue.innerText = weight.toFixed(1);
}

increaseWeight.addEventListener("click", () => {
  weight += 0.1;
  updateWeight();
});

decreaseWeight.addEventListener("click", () => {
  weight -= 0.1;
  updateWeight();
});

kgButton.addEventListener("click", () => {
  if (unit !== "KG") {
    weight = (weight / 2.205).toFixed(1); // LB'den KG'ye çevir
    unit = "KG";
    kgButton.classList.add("active");
    lbButton.classList.remove("active");
    updateWeight();
  }
});

lbButton.addEventListener("click", () => {
  if (unit !== "LB") {
    weight = (weight * 2.205).toFixed(1); // KG'den LB'ye çevir
    unit = "LB";
    lbButton.classList.add("active");
    kgButton.classList.remove("active");
    updateWeight();
  }
});

updateWeight(); // Sayfa yüklenirken kilo değeri başlatılır.

// Water Tracker
const decreaseWater = document.getElementById("decrease-water");
const increaseWater = document.getElementById("increase-water");
const waterAmount = document.getElementById("water-amount");
const progressText = document.getElementById("water-progress-text");

// Su Hedefi ve Artış/Azalış Miktarı
const totalGoal = 2.0; // Günlük su hedefi (Litre)
const step = 0.25; // Artış/Azalış değeri (0.25L)
let currentWater = 0.0; // Mevcut su miktarı

// Su Miktarını Güncelle
function updateWater() {
  waterAmount.innerText = currentWater.toFixed(2); // Su miktarını göster
  progressText.innerText = `${currentWater.toFixed(2)} / ${totalGoal}L Goal`; // Hedef metni güncelle
}

// Artırma Butonu
increaseWater.addEventListener("click", () => {
  if (currentWater + step <= totalGoal) { // Hedefi aşma kontrolü
    currentWater += step;
    updateWater();
  }
});

// Azaltma Butonu
decreaseWater.addEventListener("click", () => {
  if (currentWater - step >= 0) { // Negatif değer kontrolü
    currentWater -= step;
    updateWater();
  }
});

updateWater(); // Sayfa yüklenirken su miktarı başlatılır.

document.getElementById("submit-selected-symptoms").addEventListener("click", async () => {
  const selectedSymptoms = [];
  document.querySelectorAll(".symptom-button.active").forEach(button => {
    selectedSymptoms.push(button.getAttribute("data-symptom"));
  });

  if (selectedSymptoms.length > 0) {
    const response = await fetch('/api/daily-symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1, // Örnek kullanıcı ID
        symptoms: selectedSymptoms,
        logged_at: new Date().toISOString().split('T')[0] // Bugünün tarihi
      })
    });

    const result = await response.json();
    alert(result.message || result.error);
  } else {
    alert("Lütfen en az bir semptom seçiniz.");
  }
});

// Semptomları aktif/pasif yap
document.querySelectorAll(".symptom-button").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
  });
});

// Yemek ekleme işlemi
const mealInput = document.getElementById('meal-input');
const addMealButton = document.getElementById('add-meal-button');
const mealList = document.getElementById('meal-list');

addMealButton.addEventListener('click', () => {
  const meal = mealInput.value.trim();
  if (meal) {
    const li = document.createElement('li');
    li.textContent = meal;
    mealList.appendChild(li);
    mealInput.value = '';
  }
});

document.getElementById("submit-selected-symptoms").addEventListener("click", async () => {
  const selectedSymptoms = [];
  document.querySelectorAll(".symptom-button.active").forEach(button => {
    selectedSymptoms.push(button.getAttribute("data-symptom"));
  });

  if (selectedSymptoms.length > 0) {
    const response = await fetch('/api/daily-symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1, // Örnek kullanıcı ID
        symptoms: selectedSymptoms,
        logged_at: new Date().toISOString().split('T')[0] // Bugünün tarihi
      })
    });

    const result = await response.json();
    alert(result.message || result.error);
  } else {
    alert("Lütfen en az bir semptom seçiniz.");
  }
});
