async function carregarIncendios() {
    try {
        const resposta = await fetch('/api/incendios');
        const incendios = await resposta.json();

        const listaIncendios = document.getElementById('listaIncendios');
        listaIncendios.innerHTML = '';

        incendios.forEach((incendio) => {
            const box = document.createElement('div');
            box.classList.add('box');

            box.innerHTML = `
                <p><strong>Descrição:</strong> ${incendio.descricao}</p>
                <p><strong>Cidade:</strong> ${incendio.cidade}</p>
                <p><strong>Rua:</strong> ${incendio.rua}</p>
                <button onclick="verDetalhes(${incendio.id})">🔍 Ver Detalhes</button>
                <button onclick="editarIncendio(${incendio.id})">✏️ Editar</button>
                <button onclick="excluirIncendio(${incendio.id})">🗑️ Excluir</button>
            `;

            listaIncendios.appendChild(box);
        });
    } catch (error) {
        console.error('Erro ao carregar incêndios:', error);
    }
}

async function verDetalhes(id) {
    try {
        const resposta = await fetch(`/api/incendios/${id}`);
        const incendio = await resposta.json();

        alert(`
            Nome: ${incendio.nome}
            CPF: ${incendio.cpf}
            Cidade: ${incendio.cidade}
            Rua: ${incendio.rua}
            Descrição: ${incendio.descricao}
        `);
    } catch (error) {
        console.error('Erro ao obter detalhes do incêndio:', error);
    }
}

function editarIncendio(id) {
    window.location.href = `alertarIncendio.html?id=${id}`;
}

async function excluirIncendio(id) {
    const confirmacao = confirm('Deseja realmente excluir este incêndio?');
    if (confirmacao) {
        try {
            await fetch(`/api/incendios/${id}`, { method: 'DELETE' });
            alert('Incêndio excluído com sucesso!');
            carregarIncendios();
        } catch (error) {
            console.error('Erro ao excluir incêndio:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', carregarIncendios);