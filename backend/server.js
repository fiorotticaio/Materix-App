const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL
const db = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'pgsupercaio',
    database: 'materix_db',
    port: 5432 // Porta padrão do Postgres
});

// Rota principal
app.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM items';
        const result = await db.query(sql);
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Inicialização do servidor
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
