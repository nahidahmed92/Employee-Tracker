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

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
);
