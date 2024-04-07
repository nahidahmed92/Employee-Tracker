DROP DATABASE IF EXISTS employeeManager_db;
CREATE DATABASE employeeManager_db;

c\ employeeManager_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department INTEGER,
  FOREIGN KEY (department) REFERENCES department(id)
);
