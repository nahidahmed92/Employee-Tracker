const inquirer = require('inquirer');
const { pool } = require('../connection/db.js');
const Table = require('cli-table');
const createPrompts = require('./prompts.js');

const viewAllEmployees = () => {
  // retrieve response and set a variable for it
  const sql = `
          SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(em.first_name, ' ', em.last_name) AS manager from employees e
          JOIN roles r ON r.id = e.role_id
          JOIN departments d ON d.id = r.department
          LEFT JOIN employees em ON e.manager_id = em.id;`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    // console.log(result);

    // Create a new table instance
    const table = new Table({
      head: ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'], // Table header
    });
    // Add rows to the table
    result.rows.forEach((row) => {
      table.push([
        row.id,
        row.first_name,
        row.last_name,
        row.title,
        row.department,
        row.salary,
        row.manager,
      ]);
    });
    // Display the table
    console.log(`\n${table.toString()}`);
  });
};

const addEmployeeQuery = (response, roleChoices, managerChoices) => {
  const newEmployeeFirstName = response.employeeFirstName;
  const newEmployeeLastName = response.employeeLastName;
  const newEmployeeRoleId = parseInt(response.employeeRole);
  const newManagerId = parseInt(response.employeeManager) || null;
  const sql =
    'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
  const params = [newEmployeeFirstName, newEmployeeLastName, newEmployeeRoleId, newManagerId];

  const selectedRole = roleChoices.find((role) => role.value === newEmployeeRoleId);
  const newEmployeeRoleName = selectedRole ? selectedRole.name : null;
  const selectedManager = managerChoices.find((manager) => manager.value === newManagerId);
  const newEmployeeManagerName = selectedManager ? selectedManager.name : null;
  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(
      `\n Added ${newEmployeeLastName}, ${newEmployeeFirstName} as ${newEmployeeRoleName} that is managed by ${newEmployeeManagerName}.`
    );
  });
};

const updateEmployeeRole = (response, employeeChoices, roleChoices, callback) => {
  const employeeId = parseInt(response.employeeUpdate);
  const roleId = parseInt(response.roleUpdate);
  const sql = 'UPDATE employees SET role_id = $1 WHERE id = $2';
  const params = [roleId, employeeId];

  const selectedEmployee = employeeChoices.find((employee) => employee.value === employeeId);
  const employeeName = selectedEmployee ? selectedEmployee.name : null;
  const selectedRole = roleChoices.find((role) => role.value === roleId);
  const roleName = selectedRole ? selectedRole.name : null;

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`\n Updated ${employeeName} to be a(n) ${roleName}.`);
    if (callback) {
      callback(); // Call the callback function after the update is successful
    }
  });
};

const viewAllRoles = () => {
  // retrieve response and set a variable for it
  const sql = `
    SELECT r.id, r.title, d.name AS department, r.salary FROM roles r
    JOIN departments d ON d.id = r.department;`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    // Create a new table instance
    const table = new Table({
      head: ['ID', 'Title', 'Department', 'Salary'], // Table header
    });
    // Add rows to the table
    result.rows.forEach((row) => {
      table.push([row.id, row.title, row.department, row.salary]);
    });
    // Display the table
    console.log(`\n${table.toString()}`);
  });
};

const addRole = (response, departmentChoices) => {
  const newRoleName = response.roleName;
  const newRoleDepartmentId = response.roleDepartment;
  const newRoleSalary = parseInt(response.roleSalary);
  const sql = 'INSERT INTO roles (title, department, salary) VALUES ($1, $2, $3)';
  const params = [newRoleName, newRoleDepartmentId, newRoleSalary];

  console.log(params);

  const selectedDepartment = departmentChoices.find(
    (department) => department.value === newRoleDepartmentId
  );
  const newRoleDepartmentName = selectedDepartment ? selectedDepartment.name : null;

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log(
      `\n Added ${newRoleName} to ${newRoleDepartmentName} with a salary of ${newRoleSalary} to database.`
    );
  });
};

const viewAllDepartments = () => {
  const sql = 'SELECT * FROM departments';

  pool.query(sql, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    // Create a new table instance
    const table = new Table({
      head: ['ID', 'Name'], // Table header
    });
    // Add rows to the table
    result.rows.forEach((row) => {
      table.push([row.id, row.name]);
    });
    // Display the table
    console.log(`\n${table.toString()}`);
    // Continue the CLI flow
  });
};

const addDepartment = (response) => {
  // retrieve response and set a variable for it
  const departmentName = response.addDepartment;
  const sql = 'INSERT INTO departments (name) VALUES ($1)';

  pool.query(sql, [departmentName], (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log(`\n Added ${departmentName} to database.`);
  });
};

module.exports = {
  viewAllEmployees,
  addEmployeeQuery,
  updateEmployeeRole,
  viewAllRoles,
  addRole,
  viewAllDepartments,
  addDepartment,
};
