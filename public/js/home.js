// Simples validação de login
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'http://localhost:3000/login.html';
    }
});

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'http://localhost:3000/login.html';
}