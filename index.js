const express = require('express');
const app = express();
const PORT = 7000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// List of Employees (with sample data)
const employeesList = [
    {
        "id": 1,
        "name": "Bob Doe",
        "years_with_company": 9.5,
        "department": "HR",
        "salary": 100000
    },
    {
        "id": 2,
        "name": "Leeroy Jenkins",
        "years_with_company": 9.5,
        "department": "IT",
        "salary": 100000
    },
    {
        "id": 3,
        "name": "Rick Astley",
        "years_with_company": 9.0,
        "department": "Marketing",
        "salary": 100000
    }
];

// Routes

// Retrieve Employees
app.get('/employees', (req, res) => {

    // Calculate Employees Totals and Averages
    const totalEmployees = employeesList.length;
    const totalYearsWithCompany = employeesList.reduce((sum, employee) => sum + employee.years_with_company, 0);
    const averageYearsWithCompany = parseFloat((totalYearsWithCompany / totalEmployees).toFixed(2));
    const averageSalary = employeesList.reduce((sum, employee) => sum + employee.salary, 0) / totalEmployees;

    res.status(200).send({
        "total": totalEmployees,
        "average_years_with_company": averageYearsWithCompany,
        "average_salary": averageSalary,
        "employees": employeesList
    });
});

// Retrieve Employee by ID
app.get('/employees/:id', (req, res) => {

    if (employeesList.length === 0) {
        res.status(404).send({
            "message": "No employees found. Please add employees to the database."
        });
    }

    const id = req.params.id;
    const employee = employeesList.find((employee) => id == employee.id);

    if (!employee) {
        res.status(404).send({
            "message": `Employee not found ${id}`
        });
    }

    res.status(200).send({
        id: employee.id,
        name: employee.name,
        years_with_company: employee.years_with_company,
        department: employee.department,
        salary: employee.salary
    });
});

// Create Employee
app.post('/employees', (req, res) => {

    // Read employee data from request body
    const id = req.body.id;
    const name = req.body.name;
    const years_with_company = req.body.years_with_company;
    const department = req.body.department;
    const salary = req.body.salary;

    if (!(id && name && years_with_company && department && salary)) {
        res.status(401).send({
            "message": "Invalid request: missing a required field. Please provide all required fields."
        });
    }

    // Create a new employee
    const newEmployee = {
        id: id,
        name: name,
        years_with_company: years_with_company,
        department: department,
        salary: salary
    };

    // Add the new employee to the employees list
    employeesList.push(newEmployee);

    res.send({
        "status" : 200,
        "message": "New employee added",
        id: newEmployee.id,
    })
});

// Update Employee
app.post('/employees/:id', (req, res) => {

    if (employeesList.length === 0) {
        res.status(404).send({
            "message": "No employees found. Please add employees to the database."
        });
    }

    const id = req.params.id;
    const employee = employeesList.find((employee) => id == employee.id);

    if (!employee) {
        res.status(404).send({
            "message": `Employee not found ${id}`
        });
    }

    // Read employee data from request body
    const new_id = req.body.id;
    const new_name = req.body.name;
    const new_years_with_company = req.body.years_with_company;
    const new_department = req.body.department;
    const new_salary = req.body.salary;
 
    if (!(new_id && new_name && new_years_with_company && new_department && new_salary)) {
        res.status(401).send({
            "message": "Invalid request: missing a required field. Please provide all required fields."
        });
    }

    // Update the employee
    employee.id = new_id;
    employee.name = new_name;
    employee.years_with_company = new_years_with_company;
    employee.department = new_department;
    employee.salary = new_salary;

    res.send({
        "status" : 200,
        "message": "Employee updated",
    })
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});