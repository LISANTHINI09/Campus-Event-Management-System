import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  BookmarkCheck,
  ShieldAlert
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Calendar className="brand-icon" size={24} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">CAMPUS EVENTS</span>
            <span className="brand-subtitle">College Management Portal</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>
            Events
          </Link>

          {isAuthenticated && isStudent && (
            <>
              <Link to="/student/dashboard" className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/student/registrations" className={`nav-link ${isActive('/student/registrations') ? 'active' : ''}`}>
                My Registrations
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                Admin Portal
              </Link>
              <Link to="/admin/events" className={`nav-link ${isActive('/admin/events') ? 'active' : ''}`}>
                Manage Events
              </Link>
            </>
          )}
        </nav>

        {/* User Auth Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link 
                to={isAdmin ? "/admin/dashboard" : "/student/profile"} 
                className="user-profile-badge"
              >
                <div className="user-avatar">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{currentUser.name}</span>
                  <span className={`user-role ${isAdmin ? 'role-admin' : 'role-student'}`}>
                    {currentUser.role}
                  </span>
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm logout-btn" 
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className="mobile-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className="mobile-link" 
            onClick={() => setMobileMenuOpen(false)}
          >
            All Events
          </Link>
          {isAuthenticated && isStudent && (
            <>
              <Link 
                to="/student/dashboard" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Dashboard
              </Link>
              <Link 
                to="/student/registrations" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                My Registrations
              </Link>
              <Link 
                to="/student/profile" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <>
              <Link 
                to="/admin/dashboard" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
              <Link 
                to="/admin/events" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Events
              </Link>
              <Link 
                to="/admin/registrations" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Event Registrations
              </Link>
              <Link 
                to="/admin/students" 
                className="mobile-link" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Registered Students
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <button 
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }} 
              className="btn btn-outline-danger mobile-logout-btn"
            >
              <LogOut size={16} /> Logout ({currentUser.name})
            </button>
          ) : (
            <div className="mobile-auth-group">
              <Link 
                to="/login" 
                className="btn btn-secondary" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Registration
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
