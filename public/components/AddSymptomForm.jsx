import React, { useState } from "react";
import axios from "axios";

function AddSymptomForm() {
  const [mealId, setMealId] = useState("");
  const [symptomDescription, setSymptomDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/symptoms", { mealId, symptomDescription });
      alert("Semptom kaydedildi");
    } catch (error) {
      alert("Hata oluştu: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Öğün:
        <input
          type="text"
          value={mealId}
          onChange={(e) => setMealId(e.target.value)}
        />
      </label>
      <label>
        Semptom:
        <textarea
          value={symptomDescription}
          onChange={(e) => setSymptomDescription(e.target.value)}
        />
      </label>
      <button type="submit">Kaydet</button>
    </form>
  );
}

export default AddSymptomForm;
