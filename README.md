# Campus Event Management System

A complete full-stack web application designed for colleges and universities to digitally organize, publish, track, and manage campus events, workshops, hackathons, sports tournaments, and student registrations.

Developed using **Java Spring Boot**, **React.js**, **MySQL**, and **Hibernate JPA**, following clean, understandable, and realistic student-developer coding practices.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [REST API Endpoints](#rest-api-endpoints)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup (Spring Boot)](#2-backend-setup-spring-boot)
  - [3. Frontend Setup (React.js)](#3-frontend-setup-reactjs)
- [Sample Login Credentials](#sample-login-credentials)
- [Viva & Placement Interview Q&A](#viva--placement-interview-qa)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

In many educational institutions, campus activities and departmental workshops are still handled using physical notice boards, paper registration forms, or disconnected spreadsheets. This creates several issues:
- Students miss deadlines and event updates.
- Venues get overcrowded due to lack of seat capacity control.
- Event coordinators lack automated attendance records and registration history.

The **Campus Event Management System** solves these challenges by providing:
1. A centralized digital events catalog with multi-criteria search and category filters.
2. Real-time seat allocation preventing over-subscription beyond maximum venue capacity.
3. Strict enforcement of registration deadlines and duplicate registration prevention.
4. Personalized student dashboards for tracking upcoming and past registrations with 1-click slot cancellation.
5. Administrative portal for faculty and coordinators to create, modify, monitor attendance, and view participant rosters.

---

## Key Features

### For Students
- **Account Registration & Login**: Secure account creation with BCrypt hashed passwords.
- **Event Directory**: Real-time browsing of campus workshops, seminars, sports meets, and cultural fests.
- **Search & Filters**: Instant search by keywords and filters by Category, Status, and Date.
- **Interactive Event Details**: Detailed descriptions, schedules, venue locations, and real-time available seats.
- **1-Click Registration**: Confirms slot instantly with real-time seat decrement.
- **Duplicate Prevention**: Rejects duplicate registrations for the same event.
- **Personal Student Dashboard**: Displays enrolled events, registration timestamps, and recommended activities.
- **Registration Cancellation**: Students can cancel attendance anytime, which automatically frees up their seat for other students.
- **Profile Management**: Update contact number, department, year, and password.

### For Administrators (Event Coordinators)
- **Analytics Dashboard**: 5 KPI metrics (Total Events, Upcoming Events, Completed Events, Enrolled Students, Total Registrations) and Category Breakdown.
- **Event CRUD Operations**: Create new events, update details/schedules/venues, and delete events with confirmation modals.
- **Live Seat Tracking**: Visual progress bars displaying current enrollment vs. maximum venue capacity.
- **Registration & Attendance Roster**: Filter registrations by event and mark student attendance (`ATTENDED`) or cancel slots.
- **Student Directory**: Inspect student profiles, contact information, and academic departments.

---

## Technology Stack

### Frontend
- **React.js**: Functional components with React Hooks (`useState`, `useEffect`, `useContext`, `useSearchParams`).
- **React Router DOM (v6)**: Declarative client-side routing and protected role-based routes (`StudentRoute`, `AdminRoute`).
- **Axios**: Centralized HTTP client with response interceptors for clean error messages.
- **Lucide React**: Clean, modern icons.
- **Vanilla CSS**: Tailored design system with CSS custom properties, glassmorphism, responsive grids, and micro-interactions.

### Backend
- **Java 17**: Core language.
- **Spring Boot 3.2.2**: RESTful web services framework.
- **Spring Data JPA & Hibernate**: Entity-relationship mapping, pagination, and automated DDL schema management.
- **Jakarta Bean Validation**: Input validation annotations (`@NotBlank`, `@Email`, `@Size`, `@Min`).
- **Spring Security Crypto**: BCrypt password encoder for safe credential hashing.
- **Maven**: Dependency management and lifecycle builds (includes Maven Wrapper `mvnw`).

### Database
- **MySQL 8.0**: Relational database with foreign keys, composite unique constraints, and ACID transactions.

---

## System Architecture

```
+-------------------------------------------------------------+
|                     REACT FRONTEND                          |
|             (Vite Dev Server: localhost:5173)               |
+-------------------------------------------------------------+
                              │
                    RESTful API Calls (JSON)
                    Axios Central Client
                              │
                              ▼
+-------------------------------------------------------------+
|                  SPRING BOOT BACKEND                        |
|                  (Tomcat: localhost:8080)                   |
|                                                             |
|   Controller Layer  →  REST Endpoints & DTO Validation      |
|           │                                                 |
|   Service Layer     →  Business Rules & Transactions        |
|           │                                                 |
|   Repository Layer  →  Spring Data JPA Queries              |
+-------------------------------------------------------------+
                              │
                        Hibernate ORM
                              │
                              ▼
+-------------------------------------------------------------+
|                     MYSQL DATABASE                          |
|                     (localhost:3306)                        |
|                                                             |
|   Tables: students  |  events  |  registrations             |
+-------------------------------------------------------------+
```

---

## Database Design

```
students (1) ────────< registrations >──────── (1) events
```

- **`students`**: Stores name, email, department, academic year, phone number, role, and hashed password.
- **`events`**: Stores title, description, category, event date, start/end time, venue, organizer, max capacity, registered count, deadline, and status.
- **`registrations`**: Stores `student_id` (FK), `event_id` (FK), registration timestamp, and status (`REGISTERED`, `ATTENDED`, `CANCELLED`).
  - *Unique Constraint*: `(student_id, event_id)` prevents double registration at the database level.

SQL Dump is available in `database/campus_event_management.sql`.

---

## REST API Endpoints

### Student & Auth APIs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students/register` | Register a new student account |
| `POST` | `/api/students/login` | Authenticate student or admin |
| `GET` | `/api/students/{id}` | Get student profile details |
| `PUT` | `/api/students/{id}` | Update student profile details |
| `GET` | `/api/students` | Get list of all enrolled students (Admin) |

### Event APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List events with optional search & filters |
| `GET` | `/api/events/{id}` | Get full event details by ID |
| `POST` | `/api/events` | Create new campus event (Admin) |
| `PUT` | `/api/events/{id}` | Update existing event details (Admin) |
| `DELETE` | `/api/events/{id}` | Delete an event (Admin) |

### Registration APIs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/registrations` | Register student for an event |
| `GET` | `/api/registrations/student/{studentId}` | Get student's registrations |
| `GET` | `/api/registrations/event/{eventId}` | Get registrations for a specific event (Admin) |
| `GET` | `/api/registrations` | Get all campus registrations (Admin) |
| `DELETE` | `/api/registrations/{id}` | Cancel registration and free seat |
| `PUT` | `/api/registrations/{id}/status` | Update attendance status (Admin) |

### Dashboard APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/admin` | Aggregate metrics and breakdown for admin |
| `GET` | `/api/dashboard/student/{studentId}` | Summary metrics and upcoming events for student |

---

## Project Structure

```
Campus-Event-Management-System/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, EventCard, etc.)
│   │   ├── pages/              # Public, Student, and Admin pages
│   │   ├── services/           # Centralized Axios API services
│   │   ├── context/            # AuthContext for role-based session state
│   │   ├── App.jsx             # Routes and ProtectedRoute guards
│   │   ├── App.css             # Page and layout styles
│   │   ├── index.css           # Core design tokens
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/main/java/com/campus/eventmanagement/
│   │   ├── config/             # CorsConfig, DataInitializer
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── entity/             # JPA Entities
│   │   ├── exception/          # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── service/            # Business Logic Services
│   │   └── CampusEventManagementApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── README.md
│
├── database/
│   └── campus_event_management.sql
│
├── docs/
│   ├── project-overview.md
│   ├── database-design.md
│   ├── api-documentation.md
│   └── setup-guide.md
│
├── README.md
└── .gitignore
```

---

## How to Run

### 1. Database Setup
1. Ensure your local MySQL service is running on `localhost:3306`.
2. Create the database:
   ```sql
   CREATE DATABASE campus_event_management;
   ```
3. Import the sample data script:
   ```bash
   mysql -u root -p campus_event_management < database/campus_event_management.sql
   ```
*(Note: If you start the Spring Boot app directly, Hibernate and `DataInitializer` will automatically create the tables and seed 10 sample events, 8 students, and sample registrations if the database is newly created!)*

### 2. Backend Setup (Spring Boot)
1. Navigate to the `backend/` directory:
   ```powershell
   cd backend
   ```
2. Verify MySQL credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campus_event_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Run the application using the Maven wrapper:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
The backend API starts on **`http://localhost:8080`**.

### 3. Frontend Setup (React.js)
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
The frontend portal is accessible at **`http://localhost:5173`**.

---

## Sample Login Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@campus.edu` | `Admin@123` | Event Coordinator Console |
| **Student** | `rahul.sharma@campus.edu` | `Student@123` | Rahul Sharma (CSE, 3rd Year) |
| **Student** | `priya.patel@campus.edu` | `Student@123` | Priya Patel (IT, 2nd Year) |
| **Student** | `sneha.reddy@campus.edu` | `Student@123` | Sneha Reddy (AI & DS, 2nd Year) |

*(Quick Demo buttons on the Login page allow one-click population for test evaluations and vivas!)*

---

## Viva & Placement Interview Q&A

**Q1: How does the system prevent duplicate registrations?**
> At the business layer in `RegistrationService`, the system checks `findByStudentIdAndEventId(studentId, eventId)`. If an active registration exists, it throws a `400 Bad Request`. At the database layer, a composite unique key `UNIQUE KEY uk_student_event (student_id, event_id)` acts as a secondary safety constraint.

**Q2: How is seat capacity managed concurrently?**
> When a student registers, the method is `@Transactional`. It checks `currentRegisteredCount < maxParticipants`. Upon successful creation, `currentRegisteredCount` is incremented. When a student cancels their registration, the count is decremented, immediately making the seat available.

**Q3: How are passwords secured?**
> Passwords are never stored in plain text. We use `BCryptPasswordEncoder` with a salted hash. Sensitive password hashes are never serialized or returned in DTOs.

**Q4: How do React and Spring Boot communicate?**
> Through REST APIs over HTTP. React uses Axios with a base URL configured in `src/services/api.js`. Spring Boot uses `@CrossOrigin` configuration in `CorsConfig` allowing origins `http://localhost:5173` with credentials and standard HTTP verbs (GET, POST, PUT, DELETE).

---

## Future Enhancements
- Email and SMS reminders 24 hours prior to event commencement.
- QR-code generation on event passes for contactless mobile check-in.
- Certificate generation (PDF) automatically sent to students marked as `ATTENDED`.
- Feedback rating and photo gallery for completed campus events.
