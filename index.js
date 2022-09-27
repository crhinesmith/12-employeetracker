const inquirer = require("inquirer");
const db = require("./connection");
require('console.table');
const init = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "How do you want to view the employees?",
      choices: [
        {
          name: "View all employees",
          value: viewEmployees(),
        },
        //next choice will be the different functionalities included in the readMe
      ],
    },
  ]);
};
//for insertin new data into tables you need to use prepared statements
const viewEmployees = () => {
    db.promise().query('SELECT * FROM employee')
    .then(data => {
    console.log('\n')
    console.table(data[0])})
}

init();