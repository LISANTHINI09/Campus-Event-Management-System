# REST API Documentation

Base URL: `http://localhost:8080/api`

---

## 1. Student Endpoints (`/api/students`)

### 1.1. Register Student
- **Method**: `POST`
- **Path**: `/api/students/register`
- **Request Body**:
  ```json
  {
    "name": "Kavitha Raman",
    "email": "kavitha.raman@campus.edu",
    "department": "AI & DS",
    "year": "3rd Year",
    "phoneNumber": "9876501234",
    "password": "Password@123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 10,
    "name": "Kavitha Raman",
    "email": "kavitha.raman@campus.edu",
    "department": "AI & DS",
    "year": "3rd Year",
    "phoneNumber": "9876501234",
    "role": "STUDENT"
  }
  ```

### 1.2. Student & Admin Login
- **Method**: `POST`
- **Path**: `/api/students/login`
- **Request Body**:
  ```json
  {
    "email": "rahul.sharma@campus.edu",
    "password": "Student@123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 2,
    "name": "Rahul Sharma",
    "email": "rahul.sharma@campus.edu",
    "role": "STUDENT",
    "department": "CSE",
    "year": "3rd Year",
    "phoneNumber": "9845123456",
    "message": "Login successful"
  }
  ```

### 1.3. Get Student Profile
- **Method**: `GET`
- **Path**: `/api/students/{id}`
- **Response**: `200 OK`

### 1.4. Update Student Profile
- **Method**: `PUT`
- **Path**: `/api/students/{id}`
- **Request Body**:
  ```json
  {
    "name": "Rahul Sharma",
    "department": "CSE",
    "year": "3rd Year",
    "phoneNumber": "9845123456",
    "password": "NewPassword@123"
  }
  ```
- **Response**: `200 OK`

### 1.5. Get All Students (Admin View)
- **Method**: `GET`
- **Path**: `/api/students`
- **Response**: `200 OK` (Array of all enrolled students)

---

## 2. Event Endpoints (`/api/events`)

### 2.1. List Events (with optional Search & Filter)
- **Method**: `GET`
- **Path**: `/api/events`
- **Query Parameters**:
  - `search` (string)
  - `category` (string)
  - `status` (string)
  - `startDate` (ISO Date: `YYYY-MM-DD`)
  - `endDate` (ISO Date: `YYYY-MM-DD`)
- **Response**: `200 OK` (Array of `EventResponseDto`)

### 2.2. Get Event Details
- **Method**: `GET`
- **Path**: `/api/events/{id}`
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "eventName": "Java Full Stack Workshop",
    "description": "Comprehensive hands-on workshop...",
    "category": "Workshop",
    "eventDate": "2026-10-10",
    "startTime": "09:30 AM",
    "endTime": "04:30 PM",
    "venue": "Turing Auditorium, Block A",
    "organizerName": "Computer Science Department",
    "maxParticipants": 60,
    "currentRegisteredCount": 2,
    "availableSeats": 58,
    "registrationDeadline": "2026-10-08",
    "status": "UPCOMING",
    "createdDate": "2026-10-03",
    "registrationClosed": false
  }
  ```

### 2.3. Create Event (Admin)
- **Method**: `POST`
- **Path**: `/api/events`
- **Response**: `201 Created`

### 2.4. Update Event (Admin)
- **Method**: `PUT`
- **Path**: `/api/events/{id}`
- **Response**: `200 OK`

### 2.5. Delete Event (Admin)
- **Method**: `DELETE`
- **Path**: `/api/events/{id}`
- **Response**: `200 OK`
  ```json
  { "message": "Event deleted successfully" }
  ```

---

## 3. Registration Endpoints (`/api/registrations`)

### 3.1. Register for an Event
- **Method**: `POST`
- **Path**: `/api/registrations`
- **Request Body**:
  ```json
  {
    "studentId": 2,
    "eventId": 1
  }
  ```
- **Response**: `201 Created`
  - Returns `400 Bad Request` if duplicate registration, deadline passed, or max capacity reached.

### 3.2. Get Student's Registrations
- **Method**: `GET`
- **Path**: `/api/registrations/student/{studentId}`
- **Response**: `200 OK` (Array of registrations with flattened event details)

### 3.3. Get Event's Registrations (Admin)
- **Method**: `GET`
- **Path**: `/api/registrations/event/{eventId}`
- **Response**: `200 OK`

### 3.4. Get All Registrations (Admin)
- **Method**: `GET`
- **Path**: `/api/registrations`
- **Response**: `200 OK`

### 3.5. Cancel Registration
- **Method**: `DELETE`
- **Path**: `/api/registrations/{id}`
- **Response**: `200 OK` (Sets status to `CANCELLED` and frees up 1 seat in `events`)

### 3.6. Update Attendance Status (Admin)
- **Method**: `PUT`
- **Path**: `/api/registrations/{id}/status`
- **Request Body**:
  ```json
  { "status": "ATTENDED" }
  ```
- **Response**: `200 OK`

---

## 4. Dashboard Endpoints (`/api/dashboard`)

### 4.1. Admin Dashboard Statistics
- **Method**: `GET`
- **Path**: `/api/dashboard/admin`
- **Response**: `200 OK`
  - Returns `totalEvents`, `upcomingEvents`, `completedEvents`, `totalStudents`, `totalRegistrations`, `recentEvents`, `upcomingEventsList`, and `categoryWiseEvents`.

### 4.2. Student Dashboard Statistics
- **Method**: `GET`
- **Path**: `/api/dashboard/student/{studentId}`
- **Response**: `200 OK`
  - Returns `totalRegisteredEvents`, `upcomingRegisteredEvents`, `myUpcomingRegistrations`, `recentRegistrations`, and `recommendedEvents`.
