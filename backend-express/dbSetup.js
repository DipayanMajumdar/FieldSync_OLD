const { Pool } = require('pg');
require('dotenv').config();

const p = new Pool({
  user: process.env.DB_U,
  host: process.env.DB_H,
  database: process.env.DB_N,
  password: process.env.DB_P,
  port: process.env.DB_PT,
});

const s = `
DROP TABLE IF EXISTS aud, evd, act, wbs, prj CASCADE;

CREATE TABLE prj (
  id SERIAL PRIMARY KEY,
  tnt VARCHAR(50),
  nm VARCHAR(100),
  st VARCHAR(100)
);

CREATE TABLE wbs (
  id SERIAL PRIMARY KEY,
  pid INT REFERENCES prj(id),
  prnt_id INT REFERENCES wbs(id), -- Links L6 to L5, L5 to L4, etc.
  lvl INT,                        -- Stores the WBS level (1-6)
  cd VARCHAR(50),
  nm VARCHAR(100)
);

CREATE TABLE act (
  id SERIAL PRIMARY KEY,
  wid INT REFERENCES wbs(id),
  plan_qty DECIMAL,               -- Baseline quantity
  act_qty DECIMAL DEFAULT 0,      -- Actual completed quantity
  unt VARCHAR(20)
);

CREATE TABLE evd (
  id SERIAL PRIMARY KEY,
  pid INT REFERENCES prj(id),
  loc VARCHAR(255),               
  uri TEXT,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aud (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(50),
  act VARCHAR(50),
  bfr DECIMAL,
  aft DECIMAL,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const bld = async () => {
  try {
    await p.query(s);
    console.log('db ok');
  } catch (e) {
    console.log(e);
  } finally {
    p.end();
  }
};
bld();