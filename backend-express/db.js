const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_U,
  host: process.env.DB_H,
  database: process.env.DB_N,
  password: process.env.DB_P,
  port: process.env.DB_PT,
});

module.exports = pool;