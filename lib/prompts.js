const { pool } = require('../connection/db.js');
const { addEmployeeQuery } = require('./queries.js');

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

  const updateEmployeePrompt = (employeeChoices, roleChoices) => [
    {
      type: 'list',
      name: 'employeeUpdate',
      message: "Which employee's role do you want to update?",
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'roleUpdate',
      message: 'Which role do you want to assign for the selected employee?',
      choices: roleChoices,
    },
  ];

  const addRolePrompt = (departmentChoices) => [
    {
      type: 'input',
      name: 'roleName',
      message: 'What is the name of the role?',
    },
    {
      type: 'list',
      name: 'roleDepartment',
      message: 'Which department does the role belong to?',
      choices: departmentChoices,
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'What is the salary of the role?',
    },
  ];

  const addDepartmentPrompt = {
    type: 'input',
    name: 'addDepartment',
    message: 'What is the name of the department?',
  };

  const addEmployeePromptRes = (response, roleChoices, managerChoices) => {
    addEmployeeQuery(response, roleChoices, managerChoices);
  };

  return {
    startUp,
    addEmployeePrompt,
    updateEmployeePrompt,
    addRolePrompt,
    addDepartmentPrompt,
    addEmployeePromptRes,
  };
}

module.exports = createPrompts;
