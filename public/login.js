async function submitLogin() {
    console.log("Botão foi clicado"); // Log para depuração

    const cpf = document.getElementById('cpfLogin').value;
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
            // Configura a sessão e redireciona para a página principal
            sessionStorage.setItem('isLoggedIn', true);
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
