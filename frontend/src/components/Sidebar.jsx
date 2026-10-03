import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  BookmarkCheck, 
  User, 
  PlusCircle, 
  Users, 
  ClipboardList,
  LogOut
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const { logout, currentUser } = useAuth();

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-badge">{role === 'ADMIN' ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}</span>
        <h4 className="sidebar-user-name">{currentUser?.name}</h4>
        <p className="sidebar-user-sub">
          {role === 'ADMIN' ? 'Event Coordinator' : `${currentUser?.department || 'Student'} • ${currentUser?.year || ''}`}
        </p>
      </div>

      <nav className="sidebar-nav">
        {role === 'ADMIN' ? (
          <>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/admin/events" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>Manage Events</span>
            </NavLink>
            <NavLink 
              to="/admin/events/new" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <PlusCircle size={18} />
              <span>Create Event</span>
            </NavLink>
            <NavLink 
              to="/admin/registrations" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <ClipboardList size={18} />
              <span>Event Registrations</span>
            </NavLink>
            <NavLink 
              to="/admin/students" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Manage Students</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/student/dashboard" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>My Dashboard</span>
            </NavLink>
            <NavLink 
              to="/events" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>Browse Events</span>
            </NavLink>
            <NavLink 
              to="/student/registrations" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <BookmarkCheck size={18} />
              <span>My Registrations</span>
            </NavLink>
            <NavLink 
              to="/student/profile" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Profile Settings</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
