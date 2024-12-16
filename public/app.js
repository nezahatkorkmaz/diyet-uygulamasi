// Kullanıcı Listesini Getir
async function fetchUsers() {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Önceki verileri temizle

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.first_name} ${user.last_name} - ${user.email}`;
        userList.appendChild(li);
    });
}

// Yeni Kullanıcı Ekle
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, password })
    });

    // Formu temizle ve kullanıcıları yeniden yükle
    e.target.reset();
    fetchUsers();
});

// Sayfa Yüklendiğinde Kullanıcıları Getir
window.onload = fetchUsers;
