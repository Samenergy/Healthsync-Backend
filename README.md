# HealthSync Rwanda Backend

This repository contains the backend code for HealthSync Rwanda, a project aimed at improving healthcare record management systems in Rwanda. The backend is built using Node.js, Express, and Sequelize.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Running Migrations](#running-migrations)
- [Development](#development)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (for database)

## Folder Structure

```
.
├───config
├───controllers
├───middlewares
├───models
├───routes
└───uploads
```

## Setup Instructions

Follow these steps to get the project up and running:

1. **Clone the repository:**

   Open your terminal or command prompt and run the following command to clone the repository:

   ```bash
   git clone https://github.com/Samenergy/Healthsync-Backend.git
   ```

   Navigate into the project directory:

   ```bash
   cd healthsync-rwanda-backend
   ```

2. **Install dependencies:**

   Install the necessary dependencies using npm:

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=healthsync_db
   JWT_SECRET=your_jwt_secret
   ```

   Replace `yourpassword` and `your_jwt_secret` with your actual database password and a secret key for JWT, respectively.

4. **Run migrations:**

   To set up the database schema, run the following command:

   ```bash
   npm run migrate
   ```

5. **Start the development server:**

   Start the development server using nodemon:

   ```bash
   npm run dev
   ```

   This will start the server on the port specified in the `.env` file. Open [http://localhost:5000](http://localhost:5000) in your browser to verify that the server is running.

## Available Scripts

In the project directory, you can run the following scripts:

- **`npm run dev`**: Starts the development server using nodemon.
- **`npm run migrate`**: Runs database migrations.

## Dependencies

The project uses the following main dependencies:

- **express**: Fast, unopinionated, minimalist web framework for Node.js.
- **sequelize**: Promise-based Node.js ORM for SQL databases.
- **mysql2**: MySQL client for Node.js, designed to support MySQL features.
- **jsonwebtoken**: JSON Web Token implementation (JWT).
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **bcrypt**: Library to hash passwords.
- **cors**: Middleware to enable CORS (Cross-Origin Resource Sharing).
- **multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **uuid**: Library for generating UUIDs.
- **nodemon**: Utility that monitors for any changes in your source and automatically restarts your server.

For a complete list of dependencies, refer to the `package.json` file.

## Environment Variables

The following environment variables need to be set in your `.env` file:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=healthsync_db
JWT_SECRET=your_jwt_secret
```

## Running Migrations

To set up the database schema, run the following command:

```bash
npm run migrate
```

This will apply all the migrations defined in the `migrations` folder to your database.

## Development

### Controllers

Controllers are organized within the `controllers` directory. Each controller typically handles a specific set of routes and business logic.

### Models

The `models` directory contains the Sequelize models representing the database schema.

### Routes

The `routes` directory contains the route definitions for the application. Each route is associated with a controller.

### Middlewares

Custom middlewares are organized within the `middlewares` directory and can be used to handle common tasks such as authentication and validation.

### File Uploads

Uploaded files are stored in the `uploads` directory. The application uses `multer` for handling file uploads.

---


Happy coding!
