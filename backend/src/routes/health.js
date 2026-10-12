import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/health', async (_req, res) => {
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

export default router;
