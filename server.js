// DEPENDENCIES ======================================
const express = require('express');
const { Pool } = require('pg');

// DATA ==============================================
const pool = new Pool({
  user: 'postgres',
  password: 'columbiadev',
  host: 'localhost',
  database: 'employeeManager_db',
});

// APP/PORT ==========================================
const app = express();
const port = process.env.PORT || 3001;

// MIDDLEWARE ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTE =============================================

// INITIALIZATION ====================================
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
