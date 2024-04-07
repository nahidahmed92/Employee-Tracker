// DEPENDENCIES ======================================
const express = require('express');
const { Pool } = require('pg');

// DATA ==============================================

// APP/PORT ==========================================
const app = express();
const pool = new Pool({
  user: 'postgres',
  password: 'columbiadev',
  host: 'localhost',
  database: 'employeeManager_db',
});

// MIDDLEWARE ========================================
// ROUTE =============================================
// INITIALIZATION ====================================
