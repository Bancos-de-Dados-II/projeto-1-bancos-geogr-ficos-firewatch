// Remove caracteres não numéricos do CPF
function formatarCPF(cpf) {
    return cpf.replace(/\D+/g, ''); // Remove tudo que não é número
}

async function submitLogin() {
    console.log("Botão foi clicado"); // Log para depuração

    // Formatar o CPF para remover pontuações antes de enviar
    const cpfInput = document.getElementById('cpfLogin').value;
    const cpf = formatarCPF(cpfInput); // Limpa o CPF
    const senha = document.getElementById('passwordLogin').value;

    // Verificação simples para evitar envio de campos vazios
    if (!cpf || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf, senha }),
        });

        if (response.ok) {
            const data = await response.json();

            // Salve os dados do usuário no sessionStorage
            sessionStorage.setItem('isLoggedIn', true);
            sessionStorage.setItem('cpf', data.cpf); // Salva o CPF
            sessionStorage.setItem('nome', data.nome); // Salva o nome

            alert('Login realizado com sucesso!');
            window.location.href = 'http://localhost:3000/home.html';
        } else if (response.status === 401) {
            alert('CPF ou senha incorretos.');
        } else {
            alert('Erro ao realizar login. Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}

window.addEventListener("load", () => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        history.go(1);
    };
});
