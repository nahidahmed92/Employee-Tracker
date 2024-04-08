const { pool } = require('../server.js');
const Table = require('cli-table');
const CLI = require('./cli.js');

const viewAllEmployees = () => {
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
    // this.run();
    // const cli = new CLI();
    // cli.run();
  });
};

module.exports = { viewAllEmployees };
