# Campus Event Management System - Frontend

Modern, responsive React.js single-page application built with Vite, React Router, and Axios.

## Tech Stack
- **Library**: React 18+
- **Bundler**: Vite
- **Routing**: React Router DOM (v6+)
- **HTTP Client**: Axios (centralized in `src/services/api.js`)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS design system with custom properties and responsive layouts

## Project Structure
```
frontend/
 └── src/
     ├── components/    # Navbar, Sidebar, EventCard, EventList, EventForm, SearchBar, Filter, Modal, etc.
     ├── pages/         # Home, Events, EventDetails, Login, Register, Dashboards, Manage pages
     ├── services/      # api.js, studentService, eventService, registrationService, dashboardService
     ├── context/       # AuthContext.jsx
     ├── assets/
     ├── App.jsx        # Routing and access control
     ├── App.css        # Page layout styles
     ├── index.css      # Core design tokens & typography
     └── main.jsx
```

## How to Run
```bash
cd frontend
npm install
npm run dev
```
Client runs on `http://localhost:5173`.
