// Öğünleri API'den Getir
fetch('/api/meals')
    .then(response => response.json())
    .then(data => {
        console.log("Meals:", data);
    });
// Water Tracking
let waterAmount = 0.0;
document.getElementById("increase-water").addEventListener("click", () => {
    waterAmount += 0.25;
    updateWaterDisplay();
});
document.getElementById("decrease-water").addEventListener("click", () => {
    if (waterAmount > 0) waterAmount -= 0.25;
    updateWaterDisplay();
});
function updateWaterDisplay() {
    document.getElementById("water-amount").textContent = waterAmount.toFixed(2);
    document.getElementById("water-progress-text").textContent = `${waterAmount.toFixed(2)} / 2L Goal`;
}

// Weight Tracking
let weightValue = 64.0;
document.getElementById("increase-weight").addEventListener("click", () => {
    weightValue += 0.5;
    updateWeightDisplay();
});
document.getElementById("decrease-weight").addEventListener("click", () => {
    if (weightValue > 0) weightValue -= 0.5;
    updateWeightDisplay();
});
function updateWeightDisplay() {
    document.getElementById("weight-value").textContent = weightValue.toFixed(1);
}
