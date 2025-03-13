# Task Manager

## Installation

1. Clone the repository:
```
git clone https://github.com/shalinikatore32/task-manager-next-platform.git
```
2. Install dependencies:
```
cd task-manager-next-platform
```
For Frontend
```
cd task-manager-frontend
npm install

```
For Backend
```
cd task-manager-backend
npm install
```
3. At frontend, start the development server:
```
npm run dev
```
4. Open your browser and navigate to `http://localhost:3000`.
  
5.  At backend, start the development server:
```
npm run start:dev
```

## Usage

The Task Manager application allows you to create, read, update, and delete tasks. You can also mark tasks as completed or pending.

### API

The application exposes the following API endpoints:

- `POST /tasks`: Create a new task.
- `GET /tasks`: Retrieve all tasks.
- `GET /tasks/:id`: Retrieve a specific task by ID.
- `PUT /tasks/:id`: Update a task by ID.
- `DELETE /tasks/:id`: Delete a task by ID.

The request and response payloads follow the `CreateTaskDto` and `UpdateTaskDto` models defined in the code.

### Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.


### Testing

The application includes unit tests for the `TasksController` and `TasksService` classes. You can run the tests using the following command:

```
npm run test
```

The tests use the Jest testing framework and the Supertest library for making HTTP requests.
