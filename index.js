// Minimal Express server (ESM)
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// API routers
import toolsRouter from './BackEnd/routes/toolsRoutes.js';
import usersRouter from './BackEnd/routes/usersRoutes.js';
import bookmarksRouter from './BackEnd/routes/bookmarksRoutes.js';
import authRouter from './BackEnd/routes/authRoutes.js';
import categoryRouter from './BackEnd/routes/categoryroutes.js';
import platformsRouter from './BackEnd/routes/platformsroutes.js';
import resourcesRouter from './BackEnd/routes/resourcesRoutes.js';
import osRouter from './BackEnd/routes/osroutes.js';

dotenv.config({ path: './BackEnd/Config/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// parse JSON bodies
app.use(express.json());

app.use(cors()); // Enable CORS for all routes

app.use('/api/tools', toolsRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter)
app.use('/api/platforms', platformsRouter)
app.use('/api/os', osRouter)
app.use('/api/resources', resourcesRouter)

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'FrontEnd')));

// Simple health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}`);
});
