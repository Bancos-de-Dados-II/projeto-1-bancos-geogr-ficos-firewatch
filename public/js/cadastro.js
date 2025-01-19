// Seleção dos elementos necessários
const form = document.getElementById('form');
const campos = document.querySelectorAll('.required');
const spans = document.querySelectorAll('.span-required');

// Expressões regulares para validação
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/; // Aceita CPF com ou sem pontuação
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adiciona os event listeners para validação em tempo real
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#nome').addEventListener('input', nomeValidate);
    document.querySelector('#cpf').addEventListener('input', cpfValidate);
    document.querySelector('#email').addEventListener('input', emailValidate);
    document.querySelector('#password').addEventListener('input', mainPasswordValidate);
    document.querySelector('#confirm-password').addEventListener('input', comparePassword);
});

// Exibe o erro para um campo específico
function setError(index) {
    campos[index].style.border = '2px solid #e63636'; // Bordas vermelhas
    spans[index].style.display = 'block'; // Mostra o erro
}

// Remove o erro de um campo específico
function removeError(index) {
    campos[index].style.border = ''; // Remove as bordas vermelhas
    spans[index].style.display = 'none'; // Oculta o erro
}

// Valida o nome
function nomeValidate() {
    const nomeInput = document.querySelector('#nome');
    if (nomeInput.value.length < 3) { //verifica se o nome tem pelo menos 3 caracteres
        setError(0);
    } else {
        removeError(0);
    }
}

// Valida o CPF
function cpfValidate() {
    const cpfInput = document.querySelector('#cpf');
    if (!cpfRegex.test(cpfInput.value)) {
        setError(1);
    } else {
        removeError(1);
    }
}

// Valida o email
function emailValidate() {
    const emailInput = document.querySelector('#email');
    if (!emailRegex.test(emailInput.value)) {
        setError(2);
    } else {
        removeError(2);
    }
}

// Valida a senha principal
function mainPasswordValidate() {
    const passwordInput = document.querySelector('#password');
    if (passwordInput.value.length < 8) { //verifica se a senha tem pelo menos  8 caracteres
        setError(3);
    } else {
        removeError(3);
        comparePassword(); // Revalida a confirmação da senha
    }
}

// Compara as senhas
function comparePassword() {
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#confirm-password');

    if (passwordInput.value !== confirmPasswordInput.value || confirmPasswordInput.value.length < 8) {
        setError(4);
    } else {
        removeError(4);
    }
}

// Valida o formulário antes do envio
function validateForm() {
    let isValid = true;

    // Verifica todas as validações
    if (document.querySelector('#nome').value.length < 3) setError(0), isValid = false;
    if (!cpfRegex.test(document.querySelector('#cpf').value)) setError(1), isValid = false;
    if (!emailRegex.test(document.querySelector('#email').value)) setError(2), isValid = false;

    const senha = document.querySelector('#password').value;
    const confirmSenha = document.querySelector('#confirm-password').value;

    if (senha.length < 8) setError(3), isValid = false;
    if (senha !== confirmSenha) setError(4), isValid = false;

    return isValid;
}

// Envia os dados ao servidor
async function submitCadastro() {
    if (!validateForm()) {
        alert('Por favor, corrija os erros antes de prosseguir.');
        return;
    }

    const nome = document.querySelector('#nome').value;
    const cpf = document.querySelector('#cpf').value;
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#password').value;

    const jsonData = { nome, cpf, email, senha };

    try {
        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData),
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            window.location.replace('http://localhost:3000/home.html');
        } else {
            alert('Erro ao cadastrar usuário.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}