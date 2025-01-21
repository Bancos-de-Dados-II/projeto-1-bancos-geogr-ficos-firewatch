document.addEventListener('DOMContentLoaded', async () => {
    // Define o ícone personalizado para incêndios
    const fireIcon = L.icon({
        iconUrl: './img/fogo.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    // Inicializa o mapa centrado em Cajazeiras
    const map = L.map('map').setView([-6.891885264475363, -38.55975586995647], 14); 

    // Adiciona o tile layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    try {
        // Busca os incêndios registrados no server.js
        const resposta = await fetch('/api/incendios');
        const incendios = await resposta.json();

        // Adiciona um marcador para cada incêndio
        incendios.forEach((incendio) => {
            if (incendio.latitude && incendio.longitude) {
                const marker = L.marker([incendio.latitude, incendio.longitude], { icon: fireIcon }).addTo(map);

                // Pop-up com informações do incêndio
                marker.bindPopup(`
                    <strong>Descrição:</strong> ${incendio.descricao}<br>
                    <strong>Cidade:</strong> ${incendio.cidade}<br>
                    <strong>Rua:</strong> ${incendio.rua}<br>
                    <strong>Gravidade:</strong> ${incendio.gravidade}<br>
                    <strong>Data:</strong> ${new Date(incendio.data_registro).toLocaleString()}
                `);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar incêndios:', error);
    }
});

// Simples validação de login
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    console.log(isLoggedIn)
    if (!isLoggedIn || isLoggedIn == "false") {
        console.log("entrei if")
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'http://localhost:3000/login.html';
    }
});

botaoLogout = document.querySelector("#logout")
botaoLogout.addEventListener("click",()=> logout())

function logout() {
    sessionStorage.setItem('isLoggedIn', false);
    window.location.href = 'http://localhost:3000/login.html';
}