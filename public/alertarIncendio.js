// Abre a página de localização e armazena as coordenadas
function abrirLocalizacao() {
    window.location.href = 'http://localhost:3000/pagLocalizacao.html';
}

// Recupera a localização salva no localStorage
window.addEventListener('load', () => {
    const coordenadas = localStorage.getItem('coordenadas');
    if (coordenadas) {
        const { latitude, longitude } = JSON.parse(coordenadas);
        document.getElementById('localizacao').value = `Lat: ${latitude}, Lon: ${longitude}`;
    }
});

// Validação e envio do formulário
document.getElementById('alertForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const gravidade = document.getElementById('gravidade').value;
    const descricao = document.getElementById('descricao').value;
    const localizacao = document.getElementById('localizacao').value;

    if (!gravidade || !descricao || !localizacao) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    alert('Alerta de incêndio enviado com sucesso!');
    // Aqui você pode enviar os dados para um servidor ou salvar em um banco de dados
});
