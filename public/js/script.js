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
