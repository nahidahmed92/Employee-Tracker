const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'columbiadev',
  host: 'localhost',
  database: 'employee_manager_db',
});

module.exports = { pool };
