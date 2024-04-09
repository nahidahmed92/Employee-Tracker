const inquirer = require('inquirer');
const { pool } = require('../connection/db.js');
const createPrompts = require('./prompts.js');
const {
  viewAllEmployees,
  updateEmployeeRole,
  addRole,
  addDepartment,
  viewAllDepartments,
  viewAllRoles,
} = require('./queries.js');

class CLI {
  constructor() {
    this.prompts = createPrompts();
  }

  run() {
    return inquirer.prompt([this.prompts.startUp]).then((response) => {
      if (response.mainMenu === 'View All Employees') {
        viewAllEmployees();
        this.run();
      } else if (response.mainMenu === 'Add Employee') {
        return Promise.all([
          pool.query('SELECT id, title FROM roles'),
          pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees`),
        ]).then(([roleResult, employeeResult]) => {
          const roleChoices = roleResult.rows.map((row) => ({
            name: row.title,
            value: row.id, // Use role ID as the value
          }));

          const managerChoices = employeeResult.rows.map((row) => ({
            name: row.manager,
            value: row.id, // Use role ID as the value
          }));

          // Add "null" as the first choice in the managerChoices array
          managerChoices.unshift('null');

          return inquirer
            .prompt(this.prompts.addEmployeePrompt(roleChoices, managerChoices))
            .then((response) => {
              this.prompts.addEmployeePromptRes(response, roleChoices, managerChoices);
              this.run();
            });
        });
      } else if (response.mainMenu === 'Update Employee Role') {
        return Promise.all([
          pool.query(
            `SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employees`
          ),
          pool.query('SELECT id, title FROM roles'),
        ]).then(([employeeResult, roleResult]) => {
          const employeeChoices = employeeResult.rows.map((row) => ({
            name: row.employee_name,
            value: row.id,
          }));

          const roleChoices = roleResult.rows.map((row) => ({
            name: row.title,
            value: row.id, // Use role ID as the value
          }));

          return inquirer
            .prompt(this.prompts.updateEmployeePrompt(employeeChoices, roleChoices))
            .then((response) => {
              updateEmployeeRole(response, employeeChoices, roleChoices, viewAllEmployees);
              this.run();
            });
        });
      } else if (response.mainMenu === 'View All Roles') {
        viewAllRoles();
        this.run();
      } else if (response.mainMenu === 'Add Role') {
        return pool.query('SELECT * FROM departments').then((departmentsResult) => {
          const departmentChoices = departmentsResult.rows.map((row) => ({
            name: row.name,
            value: row.id,
          }));
          const departmentName = departmentsResult.rows.map((row) => row.name);

          return inquirer.prompt(this.prompts.addRolePrompt(departmentChoices)).then((response) => {
            addRole(response, departmentChoices);
            this.run();
          });
        });
      } else if (response.mainMenu === 'View All Departments') {
        viewAllDepartments();
        this.run();
      } else if (response.mainMenu === 'Add Department') {
        return inquirer.prompt([this.prompts.addDepartmentPrompt]).then((response) => {
          addDepartment(response);
          this.run();
        });
      } else {
        console.log('Have a great day, see you again soon.');
        return process.exit();
      }
    });
  }
}

module.exports = CLI;
