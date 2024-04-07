DROP DATABASE IF EXISTS employeeManager_db;
CREATE DATABASE employeeManager_db;

c\ employeeManager_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);
