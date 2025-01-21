// Abrir a página de localização
function abrirLocalizacao() {
    window.location.href = 'pagLocalizacao.html';
}




// Recuperar a localização do localStorage
window.addEventListener('load', () => {
    const coordenadas = localStorage.getItem('coordenadas');
    if (coordenadas) {
        const { latitude, longitude, cidade, rua } = JSON.parse(coordenadas);
        document.getElementById('localizacao').value = `Lat: ${latitude}, Lon: ${longitude}, ${rua}, ${cidade}`;
    } else {
        console.warn('Nenhuma localização encontrada.');
    }
});

// Enviar o alerta para o servidor
document.getElementById('alertForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const coordenadas = localStorage.getItem('coordenadas');
    if (!coordenadas) {
        alert('Localização não registrada. Volte para a página de localização.');
        return;
    }

    const { latitude, longitude, cidade, rua } = JSON.parse(coordenadas);
    const gravidade = document.getElementById('gravidade').value;
    const descricao = document.getElementById('descricao').value;

    // Recupera o CPF e nome do usuário (supõe-se que foram armazenados no login)
    const cpf = sessionStorage.getItem('cpf');
    const nome = sessionStorage.getItem('nome');

    if (!latitude || !longitude || !gravidade || !descricao || !cidade || !rua || !cpf || !nome) {
        alert('Por favor, preencha todos os campos obrigatórios ou certifique-se de que está logado.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/alertarIncendio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message || 'Alerta enviado com sucesso!');
            window.location.href = 'http://localhost:3000/home.html';
            
            localStorage.removeItem('coordenadas'); // Limpar dados temporários
        } else {
            alert('Erro ao enviar o alerta. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao enviar alerta:', error);
        alert('Erro de conexão com o servidor.');
    }
});