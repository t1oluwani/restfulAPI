const e = require('express');
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // This is to load OpenAPI YAML file

const app = express();
const PORT = 7000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employee_database')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Load OpenAPI specification
const swaggerDocument = YAML.load('./api-spec.yaml');
    
// Serve Swagger UI documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Employee Schema
const employeeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    job_title: String,
    years_with_company: Number,
    department: String,
    salary: Number
});

// Employee Model
const Employee = mongoose.model('Employee', employeeSchema);

// // List of Employees (with sample data)
// var employeesList = [
//     {
//         "id": 1,
//         "name": "Bob Doe",
//         "years_with_company": 9.5,
//         "department": "HR",
//         "salary": 100000
//     },
//     {
//         "id": 2,
//         "name": "Leeroy Jenkins",
//         "years_with_company": 9.5,
//         "department": "IT",
//         "salary": 100000
//     },
//     {
//         "id": 3,
//         "name": "Rick Astley",
//         "years_with_company": 9.0,
//         "department": "Marketing",
//         "salary": 100000
//     }
// ];

// Routes

// List all Employees
app.get('/employees', async (req, res) => {
    try {
        // Retrieve all employees from MongoDB excluding _id and __v fields
        const employees = await Employee.find({}, '-_id -job_title -__v');

        // Sort the employees by years with company in descending order
        const sortedEmployees = employees.sort((a, b) => b.years_with_company - a.years_with_company);

        // Calculate the total number of employees, average years with company, and average salary
        const totalEmployees = sortedEmployees.length;
        const totalYearsWithCompany = sortedEmployees.reduce((sum, employee) => sum + employee.years_with_company, 0);
        const averageYearsWithCompany = parseFloat((totalYearsWithCompany / totalEmployees).toFixed(2));
        const averageSalary = sortedEmployees.reduce((sum, employee) => sum + employee.salary, 0) / totalEmployees;

        // Return the employees list
        res.status(200).send({
            total: totalEmployees,
            average_years_with_company: averageYearsWithCompany,
            average_salary: averageSalary,
            employees: sortedEmployees
        });
        
    } catch (error) {
        // Return an error if something went wrong
        console.error('Error fetching employees:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


// Retrieve individual employee details
app.get('/employees/:id', async (req, res) => {
    try {
        // Find the employee by ID
        const id = req.params.id;
        const employee = await Employee.findOne({ id: id }, '-_id -__v');

        // Check if employee exists
        if (!employee) {
            return res.status(404).send({
                message: `Employee ${id} not found `
            });
        }

        // Return the employee details
        res.status(200).send(employee);

    } catch (error) {
        // Return an error if something went wrong
        console.error('Error fetching employee:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


// Add an Employee
app.post('/employees', async (req, res) => {
    try {
        // Read employee data from request body
        const { name, job_title, years_with_company, department, salary } = req.body;

        // Generate a new ID for the employee
        const employeeCount = await Employee.countDocuments();
        const newId = employeeCount + 1;

        // Check if all required fields are provided (ID can be 0)
        if (!(name && job_title && years_with_company && department && salary)) {
            return res.status(404).send({
                "message": "Invalid request: missing a required field. Please provide all required fields."
            });
        } else {
            const newEmployee = await Employee.create({
                id: newId,
                name: name,
                job_title: job_title,
                years_with_company: years_with_company,
                department: department,
                salary: salary
            });
            
            // Confirm the employee was added
            res.status(200).send({
                "status" : 200,
                "message": "New employee added",
                id: newEmployee.id
            });
        }    
    } catch (error) {
        // Return an error if something went wrong
        console.error('Error creating employee:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


// Update an Employee
app.put('/employees/:id', async (req, res) => {
    try {
        // Find the employee by ID
        const id = req.params.id;
        const employee = await Employee.findOne({ id: id });

        // Check if employee exists
        if (!employee) {
            return res.status(404).send({
                message: `Employee ${id} not found `
            });
        }

        // Read employee data from request body
        const { name, job_title, years_with_company, department, salary } = req.body;

        // Check if all required fields are provided (ID can be 0)
        if (!(name && job_title && years_with_company && department && salary)) {
            return res.status(404).send({
                "message": "Invalid request: missing a required field. Please provide all required fields."
            });
        } else {
            // Update the employee
            employee.name = name;
            employee.job_title = job_title;
            employee.years_with_company = years_with_company;
            employee.department = department;
            employee.salary = salary;

            // Save the updated employee
            await employee.save();

            // Confirm the employee was updated
            res.status(200).send({
                "status" : 200,
                "message": "Employee updated",
            })
        }
    } catch (error) {
        // Return an error if something went wrong
        console.error('Error creating employee:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Modify an Employee
app.patch('/employees/:id', async (req, res) => {
    try {
        // Find the employee by ID
        const id = req.params.id;
        const employee = await Employee.findOne({ id: id });

        // Check if employee exists
        if (!employee) {
            return res.status(404).send({
                message: `Employee ${id} not found `
            });
        }

        // Read employee data from request body
        const new_name = req.body.name;
        const new_job_title = req.body.job_title;
        const new_years_with_company = req.body.years_with_company;
        const new_department = req.body.department;
        const new_salary = req.body.salary;

        // Check if any required fields is provided
        if (!(new_name || new_job_title || new_years_with_company || new_department || new_salary)) {
            return res.status(404).send({
                "message": `Invalid request: missing any required field. Please provide at least one field.
                            ${new_name} ${new_job_title} ${new_years_with_company} ${new_department} ${new_salary}`
            });
        } else {
            // Update the employee
            employee.name = new_name || employee.name;
            employee.job_title = new_job_title || employee.job_title;
            employee.years_with_company = new_years_with_company || employee.years_with_company;
            employee.department = new_department || employee.department;
            employee.salary = new_salary || employee.salary;

            // Save the updated employee
            await employee.save();

            // Confirm the employee was updated
            res.status(200).send({
                "status" : 200,
                "message": "Employee modified",
            })
        }
    } catch (error) {
        // Return an error if something went wrong
        console.error('Error creating employee:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Delete an Employee
app.delete('/employees/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find the employee by ID and delete it
        await Employee.findOneAndDelete({ id: id });

        // Confirm the employee was deleted
        res.status(200).send({
            "status" : 200,
            "message": "Employee deleted",
        })

    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});