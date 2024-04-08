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
        } else if (response.mainMenu === 'Add Employee') {
          return this.addEmployee();
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
        } else if (response.mainMenu === 'Add Role') {
          return this.addRole();
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

  addEmployee() {
    return pool
      .query(
        `
    select e.id, CONCAT(e.first_name, ' ', e.last_name) as manager, r.id as role_id, r.title from employees e
    join roles r on r.id = e.role_id;`
      )
      .then((employeeRolesResults) => {
        const roleChoices = employeeRolesResults.rows.map((row) => ({
          name: row.title,
          value: row.role_id, // Use role ID as the value
        }));

        const managerChoices = employeeRolesResults.rows.map((row) => ({
          name: row.manager,
          value: row.id, // Use role ID as the value
        }));

        // Add "null" as the first choice in the managerChoices array
        managerChoices.unshift('null');

        return inquirer
          .prompt([
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
              message: "Who is the employee's manager? (if no manger select null",
              choices: managerChoices,
            },
          ])
          .then((response) => {
            const newEmployeeFirstName = response.employeeFirstName;
            const newEmployeeLastName = response.employeeLastName;
            const newRoleId = parseInt(response.employeeRole);
            const newManagerId = parseInt(response.employeeManager);
            const sql =
              'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
            const params = [newEmployeeFirstName, newEmployeeLastName, newRoleId, newManagerId];

            console.log(params);

            pool.query(sql, params, (err, result) => {
              if (err) {
                console.error('Error:', err);
                return;
              }
              console.log(
                `Added ${newEmployeeLastName}, ${newEmployeeFirstName} as ${newRoleId} that is managed by ${newManagerId} to database.`
              );
              this.run();
            });
          });
      });
  }

  addRole() {
    return pool
      .query(
        `
      SELECT departments.name AS department_name, departments.id AS department_id
      FROM departments
    `
      )
      .then((departmentsResult) => {
        const departmentChoices = departmentsResult.rows.map((row) => ({
          name: row.department_name, // Select department name
          value: row.department_id, // Use department ID as the value
        }));
        const departmentName = departmentsResult.rows.map((row) => row.name);

        return inquirer
          .prompt([
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
          ])
          .then((response) => {
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
                `Added ${newRoleName} to ${newRoleDepartmentName} with a salary of $${newRoleSalary} to database.`
              );
              this.run();
            });
          });
      });
  }

  // addRole() {
  //   return pool.query('SELECT * FROM departments').then((departmentsResult) => {
  //     const departmentChoices = departmentsResult.rows.map((row) => ({
  //       name: row.name,
  //       value: row.id, // Use department ID as the value
  //     }));

  //     return inquirer
  //       .prompt([
  //         {
  //           type: 'input',
  //           name: 'roleName',
  //           message: 'What is the name of the role?',
  //         },
  //         {
  //           type: 'list',
  //           name: 'roleDepartment',
  //           message: 'Which department does the role belong to?',
  //           choices: departmentChoices,
  //         },
  //         {
  //           type: 'input',
  //           name: 'roleSalary',
  //           message: 'What is the salary of the role?',
  //         },
  //       ])
  //       .then((response) => {
  //         const newRoleName = response.roleName;
  //         const newRoleDepartmentId = response.roleDepartment;
  //         const newRoleSalary = parseInt(response.roleSalary);
  //         const sql = 'INSERT INTO roles (title, department, salary) VALUES ($1, $2, $3)';
  //         const params = [newRoleName, newRoleDepartmentId, newRoleSalary];

  //         console.log(params);

  //         pool.query(sql, params, (err, result) => {
  //           if (err) {
  //             console.error('Error:', err);
  //             return;
  //           }
  //           console.log(
  //             `Added ${newRoleName} to ${response.roleDepartment} with a salary of ${newRoleSalary} to database.`
  //           );
  //           this.run();
  //         });
  //       });
  //   });
  // }

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
          console.log(`Added ${departmentName} to database.`);
          this.run();
        });
      });
  }
}

module.exports = CLI;
