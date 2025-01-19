async function carregarIncendioParaEditar() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        try {
            const resposta = await fetch(`/api/incendios/${id}`);
            const incendio = await resposta.json();

            document.getElementById('descricao').value = incendio.descricao;
            document.getElementById('cidade').value = incendio.cidade;
            document.getElementById('rua').value = incendio.rua;
        } catch (error) {
            console.error('Erro ao carregar incêndio para edição:', error);
        }
    }
}

async function salvarIncendio() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const descricao = document.getElementById('descricao').value;
    const cidade = document.getElementById('cidade').value;
    const rua = document.getElementById('rua').value;

    try {
        const metodo = id ? 'PUT' : 'POST';
        const url = id ? `/api/incendios/${id}` : '/api/incendios';

        await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descricao, cidade, rua }),
        });

        alert('Incêndio salvo com sucesso!');
        window.location.href = 'minhaAjuda.html';
    } catch (error) {
        console.error('Erro ao salvar incêndio:', error);
    }
}

document.addEventListener('DOMContentLoaded', carregarIncendioParaEditar);