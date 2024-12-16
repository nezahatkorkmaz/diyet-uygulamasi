import React, { useState } from "react";
import axios from "axios";

function SymptomFilter() {
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);

  const handleFilter = async () => {
    try {
      const res = await axios.get(`/api/symptoms?filter=${filter}`);
      setResults(res.data);
    } catch (error) {
      alert("Hata oluştu: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Semptom ara"
        onChange={(e) => setFilter(e.target.value)}
      />
      <button onClick={handleFilter}>Ara</button>
      <ul>
        {results.map((symptom) => (
          <li key={symptom.id}>
            {symptom.symptom_description} (Öğün ID: {symptom.meal_id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SymptomFilter;
