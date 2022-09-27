USE company_db;

INSERT INTO department (name)
VALUES 
       ('Sales'),
       ('Research and development'),
       ('Outreach'),
       ('HR');

INSERT INTO role (title, salary, department_id)
VALUES ("Lab Technician", 67000, 2),
       ("Salesperson", 55000, 1),
       ("Spokesperson", 62000, 3),
       ("HR Lead", 55000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Greg","Feingold", 2, NULL),
       ("Todd","Baker",3, 1),
       ("Teddy", "Xiu",4, NULL),
       ("Issa","Rae",1, 3);

