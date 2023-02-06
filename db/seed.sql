INSERT INTO department(name)
VALUES 
    ('Kitchen'),
    ('Grounds'),
    ('Pro Shop'),
    ('Engineering');

INSERT INTO roles(title, salary, department_id)
VALUES
    ('Executive Chef', 100000.00, 1),
    ('Pasrty Chef', 55000.00, 1),
    ('Head Golf Pro', 100000.00, 2),
    ('Assistent Pro', 45000.00, 2),
    ('Head Grounds Keeper', 90000.00, 3),
    ('Grounds Crew', 40000.00, 3),
    ('Head Engineer', 60000.00, 4),
    ('Roundsman', 45000.00, 4);

INSERT INTO employee(first_name, last_name, role_id)
VALUES
    ('Adam', 'Becker', 1),
    ('Jenny', 'Snyder', 2),
    ('Mike', 'Tyson', 3),
    ('Kermit', 'Frog', 4),
    ('Tom', 'Brady', 4),
    ('George', 'Washington', 5),
    ('Brad', 'Pitt', 6),
    ('Jenifer', 'Aniston', 7),
    ('Cynthia', 'Johnson', 8);

    UPDATE `employee_db`.`employee` SET `manager_id` = '1' WHERE (`id` > '1');