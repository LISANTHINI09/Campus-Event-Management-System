# Campus Event Management System - Setup & Execution Guide

This document provides step-by-step instructions to run the application on any standard machine with Java, Maven, Node.js, and MySQL.

---

## 1. Prerequisites
Ensure you have the following installed on your system:
- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 18+ (includes npm)
- **MySQL Server**: Version 8.0+

---

## 2. Database Setup

### Step 2.1: Start MySQL Server
Ensure your MySQL service is running on `localhost:3306`.

### Step 2.2: Create Database or Import SQL
Open your terminal, command prompt, or MySQL Workbench and run:
```bash
mysql -u root -p < database/campus_event_management.sql
```
*(Enter your MySQL root password when prompted)*

Alternatively, if you run the Spring Boot backend, it will **automatically create and update tables and seed initial sample data** via Hibernate and `DataInitializer` if the database is newly initialized!

---

## 3. Backend Setup (Spring Boot)

### Step 3.1: Configure Database Credentials
Navigate to:
`backend/src/main/resources/application.properties`

Verify or update your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campus_event_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3.2: Run the Backend
Using the included Maven wrapper in the `backend/` directory:

**On Windows:**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**On Linux / macOS:**
```bash
cd backend
./mvnw spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.

---

## 4. Frontend Setup (React.js)

### Step 4.1: Install Dependencies
Open a separate terminal window and navigate to `frontend/`:
```bash
cd frontend
npm install
```

### Step 4.2: Start the Development Server
```bash
npm run dev
```

The React frontend will be accessible at **`http://localhost:5173`**.

---

## 5. Sample Login Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Campus Event Admin | `admin@campus.edu` | `Admin@123` |
| **Student** | Rahul Sharma | `rahul.sharma@campus.edu` | `Student@123` |
| **Student** | Priya Patel | `priya.patel@campus.edu` | `Student@123` |
| **Student** | Sneha Reddy | `sneha.reddy@campus.edu` | `Student@123` |

*Tip: The login page includes quick-fill buttons so you can test either role with a single click during project evaluation.*
