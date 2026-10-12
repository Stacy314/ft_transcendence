import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', healthRouter);

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'Tamagotchi API is running' });
});

export default app;
