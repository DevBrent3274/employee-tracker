// INSTALL DEPENDENCIES
const mysql = require("mysql2");
const inquirer = require("inquirer");
const conTable = require(console.table);
// CREATING CONNECTION TO SERVER
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", // Your username
  password: "mysql123", // MySQL password
  database: "employee_db",
});

// // ESTABLISHED CONNECTION TO SERVER MAIN DISPLAY ON TERMINAL
db.connect((err) => {
  if (err) throw err;

  console.log('Server is running and you are connected to the employee database.')
  console.table("\n WELCOME TO EMPLOYEE TRACKER \n");

  //STARTS MAIN FUNCTION
  askQuestions();
});

//VARIABLES
const askNewEmployee = [
  "What is the first name?",
  "What is the last name?",
  "What is their role?",
  "Who is their manager?",
];

const roleQuery =
  'SELECT * FROM roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employee e';

const managerQuery = `SELECT CONCAT (e.first_name," ",e.last_name) AS full_name,r.title, d.name FROM employee e INNER JOIN roles r ON r.id = e.role_id INNER JOIN department d ON d.did =r.department_id WHERE name = "Management";`

// INITIAL PROMPTS & SWITCH CASE
const askQuestions = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add an employee",
        "Add a role",
        "View a department",
        "View employees",
        "View a role",
        "Update employee roles",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Add a role":
          addRole();
          break;

        case "View a department":
          viewDepartments();
          break;

        case "View employees":
          viewEmployees();
          break;

        case "View a role":
          viewRoles();
          break;

        case "Update employee roles":
          updateEmpRole();
          break;

          case 'Exit':
            process.exit();

      }
    });
};

// ALL FX PER SWITCH CASE
const addDepartment = () => {
  // show the current Departments in the database
  const query = "SELECT * FROM department";
  db.query(query, (err, results) => {
    if (err) throw err;

    console.log("List of current departments");
    console.table(results);

    // ask what the name is for the new dept
    inquirer
      .prompt([
        {
          name: "newDept",
          type: "input",
          message: "What department would you like to add?",
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO department(name) VALUES(?)`,
          [answer.newDept],
          (err, results) => {
            askQuestions();
          }
        );
      });
  });
};

const addEmployee = () => {
  db.query(roleQuery, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "fName",
          type: "input",
          message: askNewEmployee[0],
        },

        {
          name: "lName",
          type: "input",
          message: askNewEmployee[1],
        },

        {
          name: "role",
          type: "list",
          // A FX in the choices creates a new array from results (all from roles table) loops and returns
          // the array of titles
          choices: function () {
            let choiceArr = results[0].map((choice) => choice.title);
            return choiceArr;
          },
          //   asking what the role is?
          message: askNewEmployee[2],
        },
        {
          name: "manager",
          type: "list",
          // A FX that creates a new array from employee table, the concatenated first and last name
          // and returns an array of the full name
          choices: function () {
            let choiceArr = results[1].map((choice) => choice.full_name);
            return choiceArr;
          },
          // asking who is their manager
          message: askNewEmployee[3],
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO employee(first_name,last_name, role_id, manager_id) 
          VALUES (?,?, 
            (SELECT id FROM roles WHERE title = ?), 
            (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name,'',last_name) = ?)
            AS tmptable))`,
          [answer.fName, answer.lName, answer.role, answer.manager]
        );
        askQuestions();
      });
  });
};

const addRole = () => {
  const addRoleQuery = `SELECT * FROM roles; SELECT * FROM department;`;
  db.query(addRoleQuery, (err, results) => {
    if (err) throw err;

    console.log("List of current roles");
    console.table(results[0]);

    inquirer
      .prompt([
        {
          name: "newTitle",
          type: "input",
          message: "What is the new title?",
        },
        {
          name: "newSalary",
          type: "input",
          message: "What is the salary amount for the new title:",
        },
        {
          name: "dept",
          type: "list",
          // A FX that creates a new array from the department table
          //and loops through the name column and returns the new array
          choice: function () {
            let choiceArr = results[1].map((choice) => choice.name);
            return choiceArr;
          },
          message: "Choose the department for the new title?",
        },
      ])
      .then((answer) => {
        db.query(`INSERT INTO roles(title, salary, department_id) 
                VALUES("${answer.newTitle}","${answer.newSalary}", 
                (SELECT did FROM department WHERE name = "${answer.dept}"));`);
        askQuestions();
      });
  });
};

const viewDepartments = () => {
  const query = "SELECT * FROM department";
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    askQuestions();
  });
};

const viewEmployees = () => {
  const query = "SELECT * FROM employee";
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    askQuestions();
  });
};

const viewRoles = () => {
  const query = "SELECT * FROM roles";
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    askQuestions();
  });
};

const updateEmpRole = () => {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is your employee ID?",
      },
      {
        name: "role",
        type: "input",
        message: "What is your role ID?",
      },
    ])
    .then((answers) => {
      const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      db.query(query, [answers.id, answers.role], (err, results) => {
        if (err) throw err;
        console.log(results);
        askQuestions();
      });
    })
    .catch((err) => {
      throw err;
    });
};

