import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';

// const express = require('express');
import express from 'express';
// const { Pool } = require('pg');
import { Pool } from 'pg';
// const cors = require('cors');
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

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

app.post('/process-pdf', upload.single('pdf'), (req, res) => {
    const pdfPath = path.resolve(req.file.path);

    // Chama Python
    const py = spawn('C:\\Users\\caiof\\Materix\\Blueprint-analysis\\.venv\\Scripts\\python.exe', [
        'C:\\Users\\caiof\\Materix\\Blueprint-analysis\\main.py',
        pdfPath
    ]);

    let output = '';

    py.stdout.on('data', (data) => {
        output += data.toString();
    });

    py.stderr.on('data', (data) => {
        console.error('Erro Python:', data.toString());
    });

    py.on('close', () => {
        return res.json({ text: output });
    });
});

// Inicialização do servidor
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
