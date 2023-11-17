# Mahasiswa Leveling REST Service

This repository contains the backend for the Mahasiswa Leveling website, implemented using Express.js. It provides RESTful APIs to interact with the Mahasiswa Leveling platform.

## Setup and Installation

### Prerequisites
- Node.js
- Docker (Optional)

### Installation Steps

#### Local

1. Clone the repository:

   ```bash
   git clone <repository_url>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables

4. Run the server:

    ```bash
    npm run dev
    ```

#### Docker

1. Clone the repository:

   ```bash
   git clone <repository_url>
    ```

2. Build the Docker image:

    ```bash
    docker-compose build.
    ```

3. Run the Docker container:

    ```bash
    docker-compose up
    ```

### Folder Structure

1. `controllers/`: Contains the controller logic for handling HTTP requests.
2. `database/`: Place to manage database configurations and migrations.
db/: Folder for database models and schemas.
3. `middleware/`: Custom middleware functions.
4. `node_modules/`: Dependencies installed via npm.
5. `routes/`: Define API routes and their associated controllers.
6. `templates/`: Templates for SOAP services (if required).
7. `index.js`: Entry point of the application.

### Team Responsibilities
|Feature|13521015|135210025|
|-------|--------|---------|
|Initial Project Setup|✔️||
|Database Seeding|✔️||
|User Registration|✔️|✔️|
|User Login|✔️|✔️|
|User Logout|✔️||
|Middleware|✔️||
|User Profile|✔️||
|Top Up and Money|✔️|✔️|
|Merchant|✔️||
|Products|✔️|✔️|
|History|✔️|✔️|
|Template||✔️|