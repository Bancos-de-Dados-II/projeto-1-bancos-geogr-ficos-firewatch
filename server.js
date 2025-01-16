const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos

//CADASTRO
app.post('/cadastro', async (req, res) => {
  const { nome, cpf, email, senha } = req.body;

  try {
    const query = 'INSERT INTO cadastros (nome, cpf, email, senha) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [nome, cpf, email, senha]);
    res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao cadastrar usuário' });
  }
});


//LOGIN
app.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;

  try {
      const query = 'SELECT * FROM cadastros WHERE cpf = $1 AND senha = $2';
      const result = await pool.query(query, [cpf, senha]);

      if (result.rows.length > 0) {
          res.status(200).send({ message: 'Login realizado com sucesso!' });
      } else {
          res.status(401).send({ message: 'CPF ou senha incorretos.' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Erro ao processar o login.' });
  }
});


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});