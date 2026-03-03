# � Mini Feeds API

A high-performance, modular Node.js API built with **TypeScript**, **Express**, and **Prisma 7**. Designed with a focus on clean code, separation of concerns, and scalability.

---

## 🏗️ Architecture and Design Patterns

This application follows modern software engineering principles to ensure maintainability and robustness.

### � Modular Design
The codebase is organized into logical modules by function:
- **`src/app`**: Express application shell and server configuration.
- **`src/controllers`**: Request handling and validation.
- **`src/services`**: Pure business logic, decoupled from the HTTP layer.
- **`src/routes`**: API endpoint definitions.
- **`src/middlewares`**: Reusable logic for authentication, logging, and error handling.
- **`src/utils` & `src/lib`**: Shared helpers and utility libraries.

### 💍 Singleton Pattern
We utilize the **Singleton Pattern** for infrastructure components like the **`PrismaClient`**. In `src/prisma.ts`, a single instance is exported and reused across the entire application to:
- Prevent reaching the database connection limit.
- Ensure consistent database configuration.
- Manage graceful connections/disconnections centrally in `server.ts`.

### 🛡️ Clean Code & Separation of Concerns
- **Controllers** only handle input/output.
- **Services** (e.g., `AuthService`, `UserService`) encapsulate logic and database interactions.
- We use **Driver Adapters** (Prisma 7) to run database drivers directly in the TypeScript runtime, avoiding external binary dependencies.

---

## 🛠️ Technological Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v20+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Docker)
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Getting Started

Follow these steps to set up the development environment on your local machine.

### 1. Prerequisites
- Docker & Docker Compose installed.
- Node.js & npm installed.

### 2. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp Example.env .env
```

### 3. Spin up the Database
Start the PostgreSQL container using the provided Makefile:
```bash
make db-up
```

### 4. Initialize the Database Schema
This command will sync your Prisma schema with the database and generate the client.
```bash
make db-setup
```
*Alternatively, run `npm run db:setup`.*

### 5. Start the Development Server
```bash
npm run dev
```
The server will be running at `http://localhost:3000`.

---

## 📖 API Documentation

This project uses **Swagger** for API documentation. Once the server is running, you can access the interactive Swagger UI to explore and test all available endpoints.

### 🔗 Accessing Swagger UI
Visit the following URL in your browser:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### 🛠️ Available Endpoints Summary

#### **Auth**
- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Login and get JWT token.
- `GET /auth/logout` - Logout user.

#### **Users**
- `GET /users/profile` - Get current user profile (Requires JWT).

#### **Posts**
- `POST /posts` - Create a new post (Requires JWT).
- `GET /posts` - Get paginated posts.
- `POST /posts/{id}/like` - Toggle like on a post (Requires JWT).
- `POST /posts/{id}/comment` - Add a comment to a post (Requires JWT).
- `DELETE /posts/{id}` - Delete your post (Requires JWT).
- `DELETE /posts/comments/{commentId}` - Delete your comment (Requires JWT).

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `make db-up` | Starts the PostgreSQL container. |
| `make db-setup` | Syncs schema (`prisma db push`) and generates the client. |
| `npm run dev` | Starts the server with `nodemon` and `ts-node`. |
| `npm run build` | Compiles TypeScript to JavaScript (Dist). |
| `npm run start` | Runs the compiled production build. |
| `make db-down` | Stops and removes the database container. |

---

## 🔒 Security
- **Authentication**: JWT based.
- **Encryption**: Passwords hashed using `bcryptjs`.
- **Validation**: Schema validation for incoming requests.

---

## 🤝 Contribution
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
*Built with ❤️ for Mini Feeds.*
