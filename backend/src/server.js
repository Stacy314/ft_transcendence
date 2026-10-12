import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const { Pool } = pg;
const port = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'ft_transcendence',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'changeme',
});

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now');
    res.json({
      status: 'ok',
      service: 'backend',
      database: 'connected',
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'backend',
      database: 'disconnected',
      message: error.message,
    });
  }
});

app.get('/api/ping', (_req, res) => {
  res.json({
    message: 'Tamagotchi API is running',
  });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
