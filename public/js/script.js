// Water Logs Functionality
let currentWaterIntake = 0;
let dailyWaterTarget = 2; // 2L target
const waterMessage = document.getElementById("water-message");
const waterTarget = document.getElementById("water-target");
const currentWater = document.getElementById("current-water");

function logWater() {
  currentWaterIntake += 0.2; // Increase by 200ml (0.2L)
  currentWater.innerText = `${currentWaterIntake}L`;

  if (currentWaterIntake >= dailyWaterTarget) {
    waterMessage.innerText = "You have reached your daily water goal!";
    waterMessage.style.color = "green";
  } else {
    waterMessage.innerText = `You have drunk ${currentWaterIntake}L out of ${dailyWaterTarget}L.`;
    waterMessage.style.color = "black";
  }
}

// Symptom Filter Functionality
function filterSymptoms() {
  const selectedSymptom = document.getElementById("symptom-select").value;
  const filteredMeals = document.getElementById("filtered-meals");

  // Dummy filtered meals data based on symptom
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

// Trigger symptom filter function on change
document.getElementById("symptom-select").addEventListener("change", filterSymptoms);


// Kilo artırma ve azaltma butonları
const decreaseWeight = document.getElementById("decrease-weight");
const increaseWeight = document.getElementById("increase-weight");
const weightValue = document.getElementById("weight-value");

// KG/LB birim değişimi
const kgButton = document.getElementById("kg");
const lbButton = document.getElementById("lb");

let weight = 64.0; // Başlangıç kilosu
let unit = "KG";   // Varsayılan birim

// Kilo değerini güncelle
function updateWeight() {
  weightValue.innerText = weight.toFixed(1);
}

// Kilo artırma
increaseWeight.addEventListener("click", () => {
  weight += 0.1;
  updateWeight();
});

// Kilo azaltma
decreaseWeight.addEventListener("click", () => {
  weight -= 0.1;
  updateWeight();
});

// Birim değişimi: KG
kgButton.addEventListener("click", () => {
  if (unit !== "KG") {
    weight = (weight / 2.205).toFixed(1); // LB'den KG'ye çevir
    unit = "KG";
    kgButton.classList.add("active");
    lbButton.classList.remove("active");
    updateWeight();
  }
});

// Birim değişimi: LB
lbButton.addEventListener("click", () => {
  if (unit !== "LB") {
    weight = (weight * 2.205).toFixed(1); // KG'den LB'ye çevir
    unit = "LB";
    lbButton.classList.add("active");
    kgButton.classList.remove("active");
    updateWeight();
  }
});

// Sayfa yüklenirken başlangıç değeri
updateWeight();
