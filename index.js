// Minimal Express server (ESM)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './BackEnd/Config/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'FrontEnd')));

// Simple health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}`);
});
