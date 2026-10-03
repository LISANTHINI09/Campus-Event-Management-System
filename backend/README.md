# Campus Event Management System - Backend

Spring Boot 3.2.2 RESTful API service for campus event management.

## Tech Stack
- **Language**: Java 17
- **Framework**: Spring Boot 3
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8.0
- **Build Tool**: Apache Maven (with Maven Wrapper `mvnw`)
- **Security**: BCrypt Password Hashing (`spring-security-crypto`)

## Project Structure
```
backend/
 └── src/
     └── main/
         ├── java/
         │   └── com/campus/eventmanagement/
         │       ├── config/        # CorsConfig, DataInitializer
         │       ├── controller/    # REST Controllers (Student, Event, Registration, Dashboard)
         │       ├── dto/           # Data Transfer Objects
         │       ├── entity/        # JPA Entities (Student, Event, Registration)
         │       ├── exception/     # GlobalExceptionHandler, Custom Exceptions
         │       ├── repository/    # Spring Data JPA Repositories
         │       ├── service/       # Business Logic Services
         │       └── CampusEventManagementApplication.java
         │
         └── resources/
             └── application.properties
```

## How to Run
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
API runs on `http://localhost:8080/api`.
