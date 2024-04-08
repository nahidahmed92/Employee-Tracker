const inquirer = require('inquirer');
const { pool } = require('../server.js');
const Table = require('cli-table');

class CLI {
  run() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'mainMenu',
          message: 'What would you like to do?',
          choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit',
          ],
        },
      ])
      .then((response) => {
        if (response.mainMenu === 'View All Employees') {
          // retrieve response and set a variable for it
          const sql = `
          select e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, CONCAT(em.first_name, ' ', em.last_name) as manager from employees e
          join roles r on r.id = e.role_id
          join departments d on d.id = r.department
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
            console.log(table.toString());

            // Continue the CLI flow
            this.run();
          });
        } else if (response.mainMenu === 'View All Roles') {
          // retrieve response and set a variable for it
          const sql = `
          select r.id, r.title, d.name as department, r.salary from roles r
          join departments d on d.id = r.department;`;

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
            console.log(table.toString());
            // Continue the CLI flow
            this.run();
          });
        } else if (response.mainMenu === 'View All Departments') {
          // retrieve response and set a variable for it
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
            console.log(table.toString());
            // Continue the CLI flow
            this.run();
          });
        } else if (response.mainMenu === 'Add Department') {
          return this.addsDepartment();
        } else {
          console.log('Have a great day, see you again soon.');
          return process.exit();
        }
      });
  }

  addsDepartment() {
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'addDepartment',
          message: 'What is the name of the department?',
        },
      ])
      .then((response) => {
        // retrieve response and set a variable for it
        const departmentName = response.addDepartment;
        const sql = 'INSERT INTO departments (name) VALUES ($1)';

        pool.query(sql, [departmentName], (err, result) => {
          if (err) {
            console.error('Error:', err);
            return;
          }
          console.log(`Added ${departmentName} to database`);
          this.run();
        });
      });
  }
}

module.exports = CLI;
