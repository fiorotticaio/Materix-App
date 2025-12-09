import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import materialRoutes from './routes/materialRoutes.js';

import express from 'express';
import { Pool } from 'pg';
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
    port: 5432
});

// Rota principal
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM items');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota do processamento de PDF
app.post('/process-pdf', upload.single('pdf'), (req, res) => {
    const pdfPath = path.resolve(req.file.path);

    const py = spawn('C:\\Users\\caiof\\Materix\\Blueprint-analysis\\.venv\\Scripts\\python.exe', [
        'C:\\Users\\caiof\\Materix\\Blueprint-analysis\\main.py',
        pdfPath
    ]);

    let output = '';

    py.stdout.on('data', (data) => output += data.toString());
    py.stderr.on('data', (data) => console.error('Erro Python:', data.toString()));

    py.on('close', () => res.json({ text: output }));
});

// ➜ Suas rotas precisam vir ANTES do listen()
app.use('/auth', authRoutes);
app.use('/auth/password', passwordResetRoutes);
app.use("/materials", materialRoutes);


// Agora sim!
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});