const inquirer = require('inquirer');

class CLI {
  run() {
    return inquirer.prompt([
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
    ]);
  }
}

module.exports = CLI;
