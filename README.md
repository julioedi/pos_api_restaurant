# Dynamic PHP API - Migrated to Node.js with Express and TypeScript

This project is a migration of a PHP API to Node.js using **Express** and **TypeScript**. It provides functionalities to manage records in dynamic database tables (CRUD), with JWT authentication routes and WebSocket support for real-time communication.

## Features

- **JWT Authentication**: Security to protect API routes.
- **SQLite Database**: SQLite is used to store the API data.
- **WebSockets**: Real-time communication with WebSockets support.
- **Dynamic Routes**: Allows interaction with database tables dynamically (CRUD operations).
  
## Requirements

- **Node.js**: Ensure you have an appropriate version of Node.js installed (v14 or higher recommended).
- **npm or yarn**: Used to manage project dependencies.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your_username/dynamic_php_api.git
    cd dynamic_php_api
    ```

2. **Install dependencies**:

    If you use **npm**:

    ```bash
    npm install
    ```

    Or if you use **yarn**:

    ```bash
    yarn install
    ```

3. **Configure environment variables**:

    Create an `.env` file at the root of the project and define the following variables:

    ```env
    JWT_SECRET=your_secret_key
    DATABASE_PATH=./db.sqlite3
    ```

    - **JWT_SECRET**: Secret key for signing and verifying JWT tokens.
    - **DATABASE_PATH**: Path to the SQLite database file.

## Usage

1. **Compile the project**:

    To compile the TypeScript files to JavaScript, run the following command:

    ```bash
    npm run build
    ```

2. **Start the server**:

    After compiling, you can start the server with:

    ```bash
    npm start
    ```

    Or, if you're in development mode, you can use the following command for automatic reloading when files change:

    ```bash
    npm run dev
    ```

    The server will run at `http://localhost:3000`.

## API Routes

The following routes are protected by JWT authentication.

### Users

- **POST** `/api/users/login`: Login and receive a JWT token.
- **POST** `/api/users/register`: Register a new user.

### Dynamic (Interact with Database Tables)

- **GET** `/api/{table}`: Get all records from a table.
- **GET** `/api/{table}/{id}`: Get a record by its ID.
- **POST** `/api/{table}`: Insert a new record into a table.
- **PUT** `/api/{table}/{id}`: Update a record in a table.
- **DELETE** `/api/{table}/{id}`: Delete a record from a table.

**Note**: Replace `{table}` with the name of the table in the database and `{id}` with the record ID.

## WebSocket

The server also supports WebSockets. You can send and receive messages in real-time.

- **Event** `new-record`: Emitted when a new record is inserted.

### WebSocket Client Connection

You can connect to the WebSocket server using `socket.io-client`:

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Listen to events
socket.on('new-record', (message) => {
  console.log('New record:', message);
});
