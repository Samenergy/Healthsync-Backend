# HealthSync Rwanda

This is the backend API for the HealthSync Rwanda project, a platform designed to [brief description of HealthSync Rwanda's purpose]. The backend utilizes Node.js, Express.js for routing, and MongoDB as a NoSQL database for data storage.


Installation

1. Prerequisites: Ensure you have Node.js and npm (or yarn) installed on your system. You can download them from the official Node.js website (https://nodejs.org/en).

2. Clone the Repository: Use Git to clone this repository:

3.Install Dependencies: Navigate to the cloned directory and install the required packages

Bash 
npm install

Configuration

1. Database Connection:

Locate the environment variable file (e.g., .env or a similar file) in the project directory. If it doesn't exist, create one.

Add the following environment variable to the file, replacing <your_mongodb_connection_string> with your actual MongoDB connection string:

MONGODB_URI=<your_mongodb_connection_string>
You can obtain your MongoDB connection string from the Atlas dashboard (https://cloud.mongodb.com/).
