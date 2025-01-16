async function submitCadastro() { //envia os dados para o banco de dados
    const data = new FormData(form);
    const jsonData = Object.fromEntries(data.entries());

    try {
      const response = await fetch('/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        window.location.replace("http://localhost:3000/home.html"); //redireciona o usuario para a pagina principal
      } else {
        alert('Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
    
}

const form = document.getElementById('form');
const campos = document.querySelectorAll('.required');
const spans = document.querySelectorAll('.span-required');
const cpfRegex = /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))$/; 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

function setError(index){ //adiciona estilo do erro
    campos[index].style.border = '2px solid #e63636';
    spans[index].style.display = 'block';
}

function removeError(index){ //remove o estilo do erro
    campos[index].style.border = '';
    spans[index].style.display = 'none';
}

//valida nome
function nomeValidate(){
    if(campos[0].value.length < 3){ //verifica se o nome tem no minimo 3 caracteres
        setError(0)
    } else{
        removeError(0)
    };
}

//Valida CPF

function cpfValidate(){ //verifica se o cpf ta no formato correto
    
    if(!cpfRegex.test(campos[1].value)){
        setError(1);
    }
    else {
        removeError(1);
    }
}

//valida email
function emailValidate(){ //verifica se o email ta no formato correto
    if(!emailRegex.test(campos[2].value))
    {
        setError(2);
    }
    else
    {
        removeError(2);
    }
}

//valida senha
function mainPasswordValidate(){
    if(campos[3].value.length < 8) //verfica se a senha tem no minimo 8 caracterers
    {
        setError(3);
    }
    else
    {
        removeError(3);
        comparePassword();
    }
}

function comparePassword(){ //verifca se a as senhas são iguais
    if(campos[3].value == campos[4].value && campos[4].value.length >= 8)
    {
        removeError(4);
    }
    else
    {
        setError(4);
    }
}