# Employee Management API

This is a simple REST API built using Node.js, Express.js for managing employee data. It allows you to perform CRUD (Create, Read, Update, Delete) operations on employee records stored in a MongoDB database. Additionally, it provides API documentation using the OpenAPI specification.

## Deployment

This API was deployed using a Cybera instance running Ubuntu.   
The ipv6 address is: ``2605:fd00:4:1001:f816:3eff:fe13:b269``

# API Access

The API will be accessible at [http://[2605:fd00:4:1001:f816:3eff:fe13:b269]/employees](http://[2605:fd00:4:1001:f816:3eff:fe13:b269]/employees).

## API Documentation

The API documentation is available at [http://[2605:fd00:4:1001:f816:3eff:fe13:b269]/docs](http://[2605:fd00:4:1001:f816:3eff:fe13:b269]/docs),  
where you can see the endpoints and their descriptions.

## Endpoints

### List all Employees

- **URL**: `/employees`
- **Method**: GET
- **Description**: Retrieves all employees from the database, sorted by years with the company in descending order, and calculates aggregate statistics such as total number of employees, average years with the company, and average salary.

### Retrieve individual Employee details

- **URL**: `/employees/:id`
- **Method**: GET
- **Description**: Retrieves details of a specific employee by ID.

### Add an Employee

- **URL**: `/employees`
- **Method**: POST
- **Description**: Adds a new employee with provided details.

### Update an Employee

- **URL**: `/employees/:id`
- **Method**: PUT
- **Description**: Updates details of a specific employee by ID.

### Modify an Employee

- **URL**: `/employees/:id`
- **Method**: PATCH
- **Description**: Modifies details of a specific employee by ID.

### Delete an Employee

- **URL**: `/employees/:id`
- **Method**: DELETE
- **Description**: Deletes a specific employee by ID.

## Error Handling

The API handles errors gracefully and returns appropriate HTTP status codes along with error messages when something goes wrong.

## Unsupported Methods

The API handles unsupported HTTP methods with a 405 Method Not Allowed response.

## License

This project is licensed under the Apache License - see the [License](LICENSE) file for details.

## References
RESTful API: https://www.youtube.com/watch?v=-MTSQjw5DrM&ab_channel=Fireship
Cybera Instace: https://www.youtube.com/watch?v=jv4D8I_AwTQ&ab_channel=UniversityofAlberta%3ACMPUT401
Node.js Deployment: https://www.youtube.com/watch?v=oykl1Ih9pMg&ab_channel=TraversyMedia


