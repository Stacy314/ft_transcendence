import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'ft_transcendence',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'changeme',
});

export default pool;
