import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import MyRegistrations from './pages/MyRegistrations';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageEvents from './pages/ManageEvents';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventRegistrations from './pages/EventRegistrations';
import ManageStudents from './pages/ManageStudents';

import './App.css';

// Protected Route Component for Student Access
const StudentRoute = ({ children }) => {
  const { isAuthenticated, isStudent } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStudent) return <Navigate to="/admin/dashboard" replace />;
  return children;
};

// Protected Route Component for Admin Access
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/student/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Portal Routes */}
          <Route
            path="/student/dashboard"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />
          <Route
            path="/student/registrations"
            element={
              <StudentRoute>
                <MyRegistrations />
              </StudentRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <StudentRoute>
                <Profile />
              </StudentRoute>
            }
          />

          {/* Admin Portal Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <ManageEvents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/edit/:id"
            element={
              <AdminRoute>
                <EditEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/registrations"
            element={
              <AdminRoute>
                <EventRegistrations />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <ManageStudents />
              </AdminRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
