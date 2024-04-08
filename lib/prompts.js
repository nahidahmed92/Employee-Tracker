const inquirer = require('inquirer');

function createPrompts() {
  const startUp = {
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
  };

  const addEmployeePrompt = (roleChoices, managerChoices) => [
    {
      type: 'input',
      name: 'employeeFirstName',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'employeeLastName',
      message: "What is the employee's last name?",
    },
    {
      type: 'list',
      name: 'employeeRole',
      message: "What is the employee's role?",
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'employeeManager',
      message: "Who is the employee's manager? (if no manager select null)",
      choices: managerChoices,
    },
  ];

  return { startUp, addEmployeePrompt };
}

module.exports = createPrompts;
