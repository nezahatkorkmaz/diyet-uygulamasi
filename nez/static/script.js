// Öğünleri API'den Getir
fetch('/api/meals')
    .then(response => response.json())
    .then(data => {
        console.log("Meals:", data);
    });
