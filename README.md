# Healthcare Management Backend API

A secure, scalable RESTful API built for managing healthcare operations, patient records, doctors, and patient-doctor appointments/mappings.

Developed by: [Himanshi Malik](https://github.com/HimanshiMalik-14)  
GitHub Profile: [https://github.com/HimanshiMalik-14](https://github.com/HimanshiMalik-14)

---

## 📌 Project Overview & Purpose

This project is an interview assignment demonstrating production-ready backend design principles. It provides a robust, layered architecture for healthcare providers to:
- Authenticate and manage access via stateless JWT tokens with bcrypt password hashing.
- Maintain private patient health records scoped securely to the creator.
- Manage verified medical practitioners and specialists across departments.
- Assign doctors to patients with relational integrity, cascading deletions, and uniqueness guarantees.

---

## ✨ Key Features

- **JWT Authentication & Security**: Complete user registration and login flow with salted bcrypt password hashing. Passwords are never returned in database scopes or API responses.
- **Data Isolation & Ownership**: Patients and mapping records are strictly isolated to their creating user. Unauthorized access attempts return proper `404 Not Found` responses to avoid enumeration.
- **Creator-Level Doctor Permissions**: All authenticated users can view the medical directory, but updates and deletions are restricted to the creating account (`403 Forbidden` protection).
- **Relational Integrity**: Sequelize Many-to-Many associations (`Patient` $\leftrightarrow$ `Doctor` via `Mapping`) with `CASCADE` rules and compound uniqueness checks.
- **Robust Input Validation**: Strict request schema validation utilizing **Zod** for request bodies and path parameters. Malformed inputs return clean, structured `400 Bad Request` messages.
- **Graceful Error Handling**: Centralized error middleware normalizing database constraints, foreign key issues, and uncaught exceptions with standard `{ success: false, message, errors }` shapes.
- **Resilient Server Startup**: Pre-flight environment variable validation and automatic port failover (e.g., from `5000` to `5001` if already in use).

---

## 🛠️ Technologies Used

- **Runtime & Language**: Node.js 20 (CommonJS JavaScript)
- **Framework**: Express.js 4
- **Database & ORM**: PostgreSQL, Sequelize v6 (`pg`, `pg-hstore`)
- **Validation**: Zod
- **Security & Crypto**: `jsonwebtoken`, `bcryptjs`, `cors`
- **Environment Management**: `dotenv`
- **Development Tooling**: `nodemon`

---

## 📂 Project Folder Structure

```
healthcare-management-backend/
├── src/
│   ├── config/
│   │   └── db.js               # Database connection & Sequelize instance
│   ├── controllers/
│   │   ├── authController.js   # User registration & login logic
│   │   ├── patientController.js# Patient CRUD & ownership scoping
│   │   ├── doctorController.js # Doctor management & creator authorization
│   │   └── mappingController.js# Patient-Doctor assignment logic
│   ├── middleware/
│   │   ├── auth.js             # Bearer token verification & user context injection
│   │   ├── validate.js         # Generic Zod validation middleware
│   │   ├── schemas.js          # Request body & param validation schemas
│   │   └── errorHandler.js     # Global normalized error handling
│   ├── models/
│   │   ├── User.js             # User model with hidden password scope
│   │   ├── Patient.js          # Patient medical profile model
│   │   ├── Doctor.js           # Doctor directory model
│   │   ├── Mapping.js          # Patient-Doctor junction table model
│   │   └── index.js            # Model associations & relationship exports
│   ├── routes/
│   │   ├── auth.js             # Public auth routes (/api/auth)
│   │   ├── patients.js         # Protected patient endpoints (/api/patients)
│   │   ├── doctors.js          # Protected doctor endpoints (/api/doctors)
│   │   ├── mappings.js         # Protected mapping endpoints (/api/mappings)
│   │   └── index.js            # Unified API router
│   ├── app.js                  # Express application setup & middleware chain
│   └── server.js               # DB sync, env validation & server entry point
├── .env.example                # Sample environment configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies & npm scripts
└── README.md                   # Project documentation
```

---

## 🚀 Installation and Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher; v20 recommended)
- **PostgreSQL** (v14 or higher) running locally on port `5432`

### 2. Clone the Repository
```bash
git clone https://github.com/HimanshiMalik-14/healthcare-management-backend.git
cd healthcare-management-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Database & Environment
1. Start your local PostgreSQL service:
   ```bash
   # macOS (Homebrew)
   brew services start postgresql@16
   ```
2. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE healthcare_db;"
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Verify your `.env` configuration:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthcare_db
   JWT_SECRET=super_secret_healthcare_backend_jwt_key_32_chars_long_12345
   JWT_EXPIRES_IN=1d
   ```

---

## ▶️ How to Run the Project

- **Start in Production Mode**:
  ```bash
  npm start
  ```
- **Start in Development Mode (with hot-reload via nodemon)**:
  ```bash
  npm run dev
  ```

Once started, the server will connect to PostgreSQL, automatically synchronize all database tables, and start listening on:
```
Server running on port 5000
```
*(If port `5000` is currently occupied by another service, it automatically falls back to port `5001`.)*

---

## 📖 API Endpoints Reference

All requests accept and return JSON. Endpoints support optional trailing slashes. Protected endpoints require the header `Authorization: Bearer <token>`.

### 1. Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT token |

### 2. Patients (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/patients` | Create a patient record (assigned to current user) |
| `GET` | `/api/patients` | Retrieve all patients owned by current user |
| `GET` | `/api/patients/:id` | Get patient details (including assigned doctors) |
| `PUT` | `/api/patients/:id` | Update patient record (owner only) |
| `DELETE` | `/api/patients/:id` | Delete patient record (owner only) |

### 3. Doctors (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/doctors` | Add a new doctor to the directory |
| `GET` | `/api/doctors` | Retrieve all doctors |
| `GET` | `/api/doctors/:id` | Retrieve specific doctor details |
| `PUT` | `/api/doctors/:id` | Update doctor details (creator only; `403` otherwise) |
| `DELETE` | `/api/doctors/:id` | Delete doctor record (creator only; `403` otherwise) |

### 4. Patient-Doctor Mappings (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/mappings` | Assign doctor to a patient owned by caller |
| `GET` | `/api/mappings` | Retrieve all mappings for caller's patients |
| `GET` | `/api/mappings/:patientId` | Retrieve all doctors assigned to a patient |
| `DELETE` | `/api/mappings/:id` | Remove a doctor-patient assignment |

---

## 👤 Author

- **Himanshi Malik**
- GitHub Profile: [@HimanshiMalik-14](https://github.com/HimanshiMalik-14)
