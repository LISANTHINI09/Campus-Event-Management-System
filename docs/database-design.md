# Database Design & Schema Documentation

## 1. Overview
The database for the application is **MySQL 8.0**, named:
```sql
campus_event_management
```

It contains three core entities:
1. `students` - Student user accounts and administrative credentials.
2. `events` - Campus events, venue details, and capacity counters.
3. `registrations` - Join entity tracking student participation, timestamp, and attendance status.

---

## 2. Entity-Relationship (ER) Diagram

```
+------------------------------------+
|              STUDENTS              |
+------------------------------------+
| id (PK, BIGINT, AUTO_INCREMENT)    |
| name (VARCHAR(255), NOT NULL)      |
| email (VARCHAR(255), UNIQUE)       |
| department (VARCHAR(255))          |
| year (VARCHAR(255))                |
| phone_number (VARCHAR(255))        |
| password (VARCHAR(255), BCrypt)    |
| role (VARCHAR(50))                 |
+------------------------------------+
                  |
                  | 1
                  |
                  | has many
                  ↓
+------------------------------------+             +------------------------------------+
|           REGISTRATIONS            |             |               EVENTS               |
+------------------------------------+             +------------------------------------+
| id (PK, BIGINT, AUTO_INCREMENT)    |             | id (PK, BIGINT, AUTO_INCREMENT)    |
| student_id (FK -> students.id)     |             | event_name (VARCHAR(255), NOT NULL)|
| event_id (FK -> events.id)         |             | description (TEXT)                 |
| registration_date (DATETIME)       |             | category (VARCHAR(255), NOT NULL)  |
| status (VARCHAR(50), NOT NULL)     |←------------| event_date (DATE, NOT NULL)        |
+------------------------------------+   belongs   | start_time (VARCHAR(255), NOT NULL)|
  * UNIQUE KEY (student_id, event_id)       to     | end_time (VARCHAR(255))            |
                                            many   | venue (VARCHAR(255), NOT NULL)     |
                                                   | organizer_name (VARCHAR(255))      |
                                                   | max_participants (INT, NOT NULL)   |
                                                   | current_registered_count (INT)     |
                                                   | registration_deadline (DATE)       |
                                                   | status (VARCHAR(50))               |
                                                   | created_date (DATE)                |
                                                   +------------------------------------+
```

---

## 3. Table Specifications

### 3.1. `students` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each student |
| `name` | VARCHAR(255) | NOT NULL | Full name of the student |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | College email ID (used for login) |
| `department` | VARCHAR(255) | NOT NULL | Branch (CSE, IT, ECE, EEE, MECH, CIVIL, AI & DS, Other) |
| `year` | VARCHAR(255) | NOT NULL | Academic year (1st, 2nd, 3rd, 4th Year) |
| `phone_number` | VARCHAR(255) | NOT NULL | 10-digit mobile contact number |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `role` | VARCHAR(50) | NOT NULL | Access role (`STUDENT` or `ADMIN`) |

### 3.2. `events` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique event identifier |
| `event_name` | VARCHAR(255) | NOT NULL | Title of the event |
| `description` | TEXT | NULLABLE | Detailed description and agenda |
| `category` | VARCHAR(255) | NOT NULL | Technical, Workshop, Seminar, Cultural, Sports, Hackathon, etc. |
| `event_date` | DATE | NOT NULL | Scheduled date of the event |
| `start_time` | VARCHAR(255) | NOT NULL | Starting time (e.g. 09:30 AM) |
| `end_time` | VARCHAR(255) | NULLABLE | Ending time (e.g. 04:30 PM) |
| `venue` | VARCHAR(255) | NOT NULL | Hall / Auditorium / Ground location |
| `organizer_name` | VARCHAR(255) | NOT NULL | Department or club organizing the event |
| `max_participants` | INT | NOT NULL | Maximum seat capacity |
| `current_registered_count` | INT | NOT NULL, DEFAULT 0 | Count of active student registrations |
| `registration_deadline` | DATE | NOT NULL | Last date to enroll |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'UPCOMING' | `UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED` |
| `created_date` | DATE | NOT NULL | Date when event was published |

### 3.3. `registrations` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique registration record ID |
| `student_id` | BIGINT | FOREIGN KEY (`students.id`), NOT NULL | Reference to the registered student |
| `event_id` | BIGINT | FOREIGN KEY (`events.id`), NOT NULL | Reference to the campus event |
| `registration_date` | DATETIME | NOT NULL | Timestamp when registration occurred |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'REGISTERED' | Status (`REGISTERED`, `ATTENDED`, `CANCELLED`) |

**Constraints:**
- Composite Unique Key: `UNIQUE KEY uk_student_event (student_id, event_id)` prevents accidental double registrations at the database level.
- Referential Integrity: Foreign keys ensure referential consistency with cascading integrity.

---

## 4. Business Rule Implementations at Database/Service Layer
1. **Prevent Duplicate Registration**:
   - Backed by `findByStudentIdAndEventId()` logic and database unique constraint.
2. **Prevent Registration Beyond Deadline**:
   - `LocalDate.now().isAfter(event.getRegistrationDeadline())` throws `400 Bad Request`.
3. **Prevent Registration Beyond Capacity**:
   - `event.getCurrentRegisteredCount() >= event.getMaxParticipants()` throws `400 Bad Request`.
4. **Slot Re-allocation on Cancellation**:
   - Cancelling a registration updates status to `CANCELLED` and decrements `currentRegisteredCount`.
