const inquirer = require("inquirer");
const { listenerCount } = require("./connection");
const db = require("./connection");
require('console.table');
const VIEW_EMPLOYEES = "VIEW_EMPLOYEES";
const VIEW_DEPARTMENTS = "VIEW_DEPARTMENTS";
const VIEW_ROLES = "VIEW_ROLES";
const ADD_DEPARTMENT = "ADD_DEPARTMENT";
const ADD_ROLE = "ADD_ROLE";
const ADD_EMPLOYEE = "ADD_EMPLOYEE";
const UPDATE_EMPLOYEE = "UPDATE_EMPLOYEE";
const departments = ['Sales', 'Research and development','Outreach','HR'];



function init() {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do with the company organizational chart?",
      choices: [
        {
          name: "View all employees",
          value: VIEW_EMPLOYEES,
        },
        {
          name: "View all departments",
          value: VIEW_DEPARTMENTS,
        },
        {
          name: "View all roles",
          value: VIEW_ROLES,
        },
        {
          name: "Add a department",
          value: ADD_DEPARTMENT,
        },
        {
          name: "Add a role",
          value: ADD_ROLE,
        },
        {
          name: "Add an employee",
          value: ADD_EMPLOYEE,
        },
        {
          name: "Update and employee's role",
          value: UPDATE_EMPLOYEE,
        },
        {
          name: "Exit Selection",
          value: 'EXIT',
        },
      ],
    },
  ]).then(answers => {
    const choice = answers.choice
    console.log(choice)
    switch(choice) {
      
      case 'VIEW_EMPLOYEES':
      viewEmployees();
      break;

      case 'VIEW_DEPARTMENTS':
      viewDepartments();
      break;

      case 'VIEW_ROLES':
      viewRoles();
      break;

      case 'ADD_DEPARTMENT':
      addDepartment();
      break;

      case 'ADD_ROLE':
      addRole();
      break;

      case 'ADD_EMPLOYEE':
      addEmployee();
      break;

      case 'UPDATE_EMPLOYEE':
      updateRole();
      break;

      case 'EXIT':
      console.log('Goodbye')
      process.exit();
    }
  });
};

//for insertin new data into tables you need to use prepared statements
function viewEmployees() {
    db.promise().query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(manager.first_name," " ,manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id')
    .then((data) => {
    console.log('\n')
    console.table(data[0])
    init()})
   
}

function viewDepartments() {
  db.promise().query('SELECT * FROM department')
  .then((data) => {
  console.log('\n')
  console.table(data[0])
  init()})
};


//here function operates different than making a const saved to function (arrow function)
function viewRoles () {
  db.promise().query('SELECT * FROM role')
  .then((data) => {
  console.log('\n')
  console.table(data[0])
  init()})
};

function addDepartment () {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addedDepartment',
      message: "What department would you like to add?"
    }
  ]).then(answers => {
    departments.push(answers.addedDepartment)
    db.promise().query('INSERT INTO department (name) values (?)', answers.addedDepartment)
    .then((data) => {
    console.log('\n')
    console.table(data[0])
    viewDepartments()
    })
  })}


async function addRole() {
  var departmentList = await db.promise().query('SELECT * FROM department')
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addedRole',
      message: "What role would you like to add?"
    },
    {
      type: 'input', 
      name: 'addedSalary',
      message: "What is the salary for this role?"
    },
    {
      type: "list",
      name: "choice",
      message: "What department does this new role belong to?",
      choices: departmentList[0].map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]).then(answers => {
    db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?,?, ?)', [answers.addedRole, answers.addedSalary, answers.choice ])
    .then((data) => {
    console.log('\n')
    console.table(data[0])})
    .then((res)=> {viewRoles()
    })
  })
  // inquirer.prompt([
  //   {
  //     type: 'input', 
  //     name: 'addedSalary',
  //     message: "What is the salary for this role?"
    // }
  // ]).then(answers => {
  //   db.promise().query('INSERT INTO role (salary) values (?)', answers.addedSalary)
  //   .then((data) => {
  //   console.log('\n')
  //   console.table(data[0])})
  // })
  
};

async function addEmployee() {
  var rolesList = await db.promise().query('SELECT * FROM role')
  var managerList = await db.promise().query('SELECT * FROM employee  LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL')
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addedEmployeeFirst',
      message: "What is the first name of the employee you would like to add?"
    },
    {
      type: 'input', 
      name: 'addedEmployeeLast',
      message: "What is the last name of the employee you would like to add?"
    },
    {
      type: "list",
      name: "choice1",
      message: "What role does this new employee have?",
      choices: rolesList[0].map((role) => ({
        name: role.title,
        value: role.id,
      }))
    },
    {
      type: "list",
      name: "choice2",
      message: "To whom does this new employee report?",
      choices: managerList[0].map((manager) => ({
        name: manager.first_name,
        value: manager.id,
      })),
    },
  ]).then(answers => {
    // const newName = answers.choice2.split(" ")
    // const firstName = newName[0];
    // const lastName = newName[1];
    db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answers.addedEmployeeFirst, answers.addedEmployeeLast, answers.choice1, answers.choice2 ])
    .then((data) => {
    console.log('\n')
    console.table(data[0])})
    .then((res)=> {viewEmployees()
    })
  })
};

async function updateRole(){
  var employeeList = await db.promise().query('SELECT * FROM employee')
  var rolesList = await db.promise().query('SELECT * FROM role')
  inquirer.prompt([
    {
      type: 'list',
      message: "Which employee's role would you like to update?",
      name: 'updatedEmployee',
      choices: employeeList[0].map((employee) => ({
        name: employee.first_name,
        value: employee.id,
      }))

    },
    {
      type: 'list',
      message: "Which role would you like to assign to this employee?",
      name: 'newRole',
      choices: rolesList[0].map((role) => ({
        name: role.title,
        value: role.id,
      }))

    }

  ]).then((res) => {
    db.promise().query(`UPDATE employee SET role_id = ${res.newRole} WHERE id = ${res.updatedEmployee}`)
    .then((res)=> {viewEmployees()
    })
  })
};


init();