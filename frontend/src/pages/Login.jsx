import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const user = await login(email.trim(), password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo fill buttons for viva/evaluation
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <LogIn size={26} />
          </div>
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to your Campus Event account</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder="e.g. rahul.sharma@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon" />
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg full-width auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="demo-credentials-box">
          <span className="demo-box-title">Project Viva / Quick Demo Credentials:</span>
          <div className="demo-btns-grid">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('rahul.sharma@campus.edu', 'Student@123')}
            >
              <UserCheck size={14} />
              <span>Student (Rahul)</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('priya.patel@campus.edu', 'Student@123')}
            >
              <UserCheck size={14} />
              <span>Student (Priya)</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('admin@campus.edu', 'Admin@123')}
            >
              <ShieldCheck size={14} />
              <span>Admin (Coordinator)</span>
            </button>
          </div>
        </div>

        <div className="auth-footer-link">
          Don't have a student account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
