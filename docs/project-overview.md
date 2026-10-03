# Campus Event Management System - Project Overview

## 1. Introduction
The **Campus Event Management System** is a full-stack web application engineered to digitize, organize, and streamline college events. It connects college administration, event coordinators, academic departments, and students under a unified digital platform.

## 2. Project Purpose & Academic Goals
- **Eliminate manual paper-based notices and spreadsheets** for event registrations.
- **Provide real-time seat availability and deadline enforcement** so venues are not overcrowded.
- **Give students personalized event dashboards** with active registration tracking and instant slot cancellation.
- **Equip administrators with live analytics**, participant rosters, and full event lifecycle controls (Create, Read, Update, Delete).
- **Designed for placement interviews, project vivas, and GitHub portfolios** using clean, humanized code.

## 3. User Roles & Capabilities

### Student Role
- **Account Registration & Login**: Safe BCrypt hashed credentials.
- **Event Discovery**: Explore upcoming workshops, hackathons, sports meets, seminars, and fests.
- **Search & Filters**: Multi-criteria search by keyword, category, status, and date range.
- **Event Registration**: 1-click registration with real-time seat decrement.
- **Registration Safeguards**: Strict prevention of duplicate registrations, registrations after deadlines, or when capacity is exhausted.
- **My Registrations**: History of registered events with status (`REGISTERED`, `ATTENDED`, `CANCELLED`).
- **Slot Cancellation**: Ability to cancel a registration anytime to instantly free up the slot for fellow students.
- **Student Profile**: View and edit personal contact details and change password.

### Admin Role (Event Coordinators & Faculty)
- **Coordinator Dashboard**: Real-time KPI cards for Total Events, Upcoming Events, Completed Events, Total Students, and Total Registrations.
- **Event Management**: Create new events, modify timing/venue/capacity, and delete past/cancelled events.
- **Roster & Attendance**: Filter registrations by event and mark student attendance (`ATTENDED`) or cancel invalid slots.
- **Student Directory**: View all registered students grouped by department and academic year.
- **Category Analytics**: Live distribution of campus activities across technical, cultural, sports, and workshop streams.

## 4. Key Architectural Highlights
- **Decoupled Architecture**: Spring Boot backend running on `localhost:8080` communicates with a React Vite frontend on `localhost:5173` via standard REST APIs.
- **Layered Backend**: Strict separation of concerns (`Controller` → `Service` → `Repository` → `Database`).
- **Safe DTO Layer**: Avoids circular JSON serialization and never exposes student passwords in API responses.
- **Automated Data Seeding**: `DataInitializer` seeds an administrator account, 8 diverse students, 10 college events, and initial registrations on first startup.
