const express = require('express');
const app = express();
const PORT = 7000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// List of Employees (with sample data)
var employeesList = [
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

// List all Employees
app.get('/employees', (req, res) => {

    // Sort the employees by years with company in descending order
    employeesList = employeesList.sort((a, b) => b.years_with_company - a.years_with_company);

    // Calculate Employees Totals and Averages
    const totalEmployees = employeesList.length;
    const totalYearsWithCompany = employeesList.reduce((sum, employee) => sum + employee.years_with_company, 0);
    const averageYearsWithCompany = parseFloat((totalYearsWithCompany / totalEmployees).toFixed(2));
    const averageSalary = employeesList.reduce((sum, employee) => sum + employee.salary, 0) / totalEmployees;

    // Return the list of employees
    res.status(200).send({
        "total": totalEmployees,
        "average_years_with_company": averageYearsWithCompany,
        "average_salary": averageSalary,
        "employees": employeesList
    });
});


// Retrieve individual employee details
app.get('/employees/:id', (req, res) => {

    // Check if employees list is empty
    if (employeesList.length === 0) {
        res.status(404).send({
            "message": "No employees found. Please add employees to the database."
        });
    }

    // Find the employee by ID
    const id = req.params.id;
    const employee = employeesList.find((employee) => id == employee.id);

    // Check if employee exists
    if (!employee) {
        res.status(404).send({
            "message": `Employee not found ${id}`
        });
    }

    // Return the employee details
    res.status(200).send({
        id: employee.id,
        name: employee.name,
        years_with_company: employee.years_with_company,
        department: employee.department,
        salary: employee.salary
    });
});


// Add an Employee
app.post('/employees', (req, res) => {

    // Read employee data from request body
    const id = req.body.id;
    const name = req.body.name;
    const years_with_company = req.body.years_with_company;
    const department = req.body.department;
    const salary = req.body.salary;

    // Check if all required fields are provided (ID can be 0))
    if (!((id == 0 || id) && name && years_with_company && department && salary)) {
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

    // Confirm the employee was added
    res.send({
        "status" : 200,
        "message": "New employee added",
        id: newEmployee.id,
    })
});


// Update an Employee
app.put('/employees/:id', (req, res) => {

    // Check if employees list is empty
    if (employeesList.length === 0) {
        res.status(404).send({
            "message": "No employees found. Please add employees to the database."
        });
    }

    // Find the employee by ID
    const id = req.params.id;
    const employee = employeesList.find((employee) => id == employee.id);

    // Check if employee exists
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
 
    // Check if all required fields are provided
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

    // Confirm the employee was updated
    res.send({
        "status" : 200,
        "message": "Employee updated",
    })
});

// Modify an Employee
app.patch('/employees/:id', (req, res) => {

    // Check if employees list is empty
    if (employeesList.length === 0) {
        res.status(404).send({
            "message": "No employees found. Please add employees to the database."
        });
    }

    // Find the employee by ID
    const id = req.params.id;
    const employee = employeesList.find((employee) => id == employee.id);

    // Check if employee exists
    if (!employee) {
        res.status(404).send({
            "message": `Employee not found ${id}`
        });
    }

    // Read employee data from request body if provided, otherwise use the existing data
    var mod_id = employee.id;
    if (req.body.id) {
        mod_id = req.body.id;
    }
    var mod_name = employee.name;
    if (req.body.name) {
        mod_name = req.body.name;
    }
    var mod_years_with_company = employee.years_with_company;
    if (req.body.years_with_company) {
        mod_years_with_company = req.body.years_with_company;
    }
    var mod_department = employee.department;
    if (req.body.department) {
        mod_department = req.body.department;
    }
    var mod_salary = employee.salary;
    if (req.body.salary) {
        mod_salary = req.body.salary;
    }
 
    // Check if at least one field is provided
    if (!(mod_id || mod_name || mod_years_with_company || mod_department || mod_salary)) {
        res.status(401).send({
            "message": "Invalid request: missing a required field. Please provide at least one field."
        });
    }

    // Modify the Employee
    employee.id = mod_id;
    employee.name = mod_name;
    employee.years_with_company = mod_years_with_company;
    employee.department = mod_department;
    employee.salary = mod_salary;

    // Confirm the employee was modified
    res.send({
        "status" : 200,
        "message": "Employee modified",
    })
});

// Delete an Employee
app.delete('/employees/:id', (req, res) => {

    //  Check if employees list is empty
    if (employeesList.length === 0) {
        res.status(404).send({
            "message": "No employees found. Please add employees to the database."
        });
    }

    // Find the employee by ID
    const id = req.params.id;
    const employee = employeesList.find((employee) => id == employee.id);

    // Check if employee exists
    if (!employee) {
        res.status(404).send({
            "message": `Employee not found ${id}`
        });
    }

    // Delete the employee
    employeesList.splice(employeesList.indexOf(employee), 1);

    // Confirm the employee was deleted
    res.send({
        "status" : 200,
        "message": "Employee deleted",
    })
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});