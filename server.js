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

//Salvar dados do cadastro
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


//Comparar dados para login
app.post('/login', async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const query = 'SELECT nome, cpf FROM cadastros WHERE cpf = $1 AND senha = $2';
        const result = await pool.query(query, [cpf, senha]);

        if (result.rows.length > 0) {
            const { nome } = result.rows[0]; // Extrai o nome do banco
            res.status(200).send({ message: 'Login realizado com sucesso!', nome, cpf });
        } else {
            res.status(401).send({ message: 'CPF ou senha incorretos.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erro ao processar o login.' });
    }
});

// Alertar incêndio
app.post('/alertarIncendio', async (req, res) => {
    const { descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome } = req.body;

    // Validação básica dos campos
    if (!descricao || !gravidade || !latitude || !longitude || !cidade || !rua || !cpf || !nome) {
        return res.status(400).send({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    console.log('Dados recebidos:', { descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome });

    try {
        const query = `
            INSERT INTO incendios (descricao, gravidade, localizacao, cidade, rua, cpf, nome)
            VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, $7, $8)
        `;
        await pool.query(query, [descricao, gravidade, longitude, latitude, cidade, rua, cpf, nome]);
        res.status(201).send({ message: 'Alerta de incêndio registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar no banco:', error);
        res.status(500).send({ message: 'Erro ao registrar alerta de incêndio.' });
    }
});


// Salvar localização
app.post('/incendios', async (req, res) => {
  const { cidade, rua, latitude, longitude } = req.body;

  try {
      const query = `
          INSERT INTO incendios (descricao, cidade, rua, localizacao) 
          VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326))
      `;
      await pool.query(query, ['Localização registrada', cidade, rua, longitude, latitude]);
      res.status(201).send({ message: 'Localização registrada com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Erro ao registrar localização.' });
  }
});


// Listar todos os incêndios
app.get('/api/incendios', async (req, res) => {
    try {
        const query = `
            SELECT id, cidade, rua, descricao, gravidade, data_registro, nome, cpf,
                   ST_X(localizacao::geometry) AS longitude,
                   ST_Y(localizacao::geometry) AS latitude
            FROM incendios
        `;
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar incêndios:', error);
        res.status(500).send({ message: 'Erro ao listar incêndios.' });
    }
});

// Mostrar no mapa incendios registrados
/*app.get('/api/incendios', async (req, res) => {
    try {
        const query = `
            SELECT id, descricao, cidade, rua, gravidade, data_registro,
                   ST_X(localizacao::geometry) AS longitude,
                   ST_Y(localizacao::geometry) AS latitude
            FROM incendios
        `;
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar incêndios:', error);
        res.status(500).send({ message: 'Erro ao listar incêndios.' });
    }
});*/

// Obter detalhes de um incêndio por ID
app.get('/api/incendios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT cidade, rua, descricao, gravidade, data_registro, nome, cpf
            FROM incendios
            WHERE id = $1
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Incêndio não encontrado.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar detalhes do incêndio:', error);
        res.status(500).send({ message: 'Erro ao buscar detalhes do incêndio.' });
    }
});


// Adicionar um novo incêndio
app.post('/api/incendios', async (req, res) => {
  const { descricao, cidade, rua, cadastro_id } = req.body;
  try {
      await pool.query(
          'INSERT INTO incendios (descricao, cidade, rua, cadastro_id) VALUES ($1, $2, $3, $4)',
          [descricao, cidade, rua, cadastro_id]
      );
      res.status(201).send({ message: 'Incêndio registrado com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Erro ao registrar incêndio' });
  }
});

// Atualizar um incêndio
app.put('/api/incendios/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, cidade, rua } = req.body;
  try {
      const result = await pool.query(
          'UPDATE incendios SET descricao = $1, cidade = $2, rua = $3 WHERE id = $4',
          [descricao, cidade, rua, id]
      );

      if (result.rowCount === 0) {
          return res.status(404).send({ message: 'Incêndio não encontrado' });
      }

      res.send({ message: 'Incêndio atualizado com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Erro ao atualizar incêndio' });
  }
});

// Excluir um incêndio
app.delete('/api/incendios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM incendios WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send({ message: 'Incêndio não encontrado.' });
        }

        res.send({ message: 'Incêndio excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir incêndio:', error);
        res.status(500).send({ message: 'Erro ao excluir incêndio.' });
    }
});



app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});