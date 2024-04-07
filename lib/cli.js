const inquirer = require('inquirer');
const { pool } = require('../server.js');

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
        if (response.mainMenu === 'Add Department') {
          console.log('-----ADD DEPT-----');
          return this.addsDepartment();
        } else {
          return console.log('Have a great day, see you again soon.');
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
        // TODO: add code here to insert new department
        const departmentName = response.addDepartment;
        const sql = 'INSERT INTO departments (name) VALUES ($1)';

        pool.query(sql, [departmentName], (err, result) => {
          if (err) {
            console.error('Error:', err);
            return;
          }
          console.log('results: ', result);
          this.run();
        });
      });
  }
}

module.exports = CLI;
