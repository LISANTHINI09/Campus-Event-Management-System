import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="portal-footer">
      <div className="container footer-content-grid">
        {/* Brand Col */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <div className="footer-icon-box">
              <Calendar size={20} />
            </div>
            <span>CAMPUS EVENT MANAGEMENT SYSTEM</span>
          </div>
          <p className="footer-desc">
            A comprehensive, digital campus event management platform connecting students,
            departments, clubs, and event organizers for seamless event coordination.
          </p>
          <div className="footer-badges">
            <span className="badge badge-category">Spring Boot 3</span>
            <span className="badge badge-category">React.js</span>
            <span className="badge badge-category">MySQL</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/events">Browse Events</Link></li>
            <li><Link to="/login">Student / Admin Login</Link></li>
            <li><Link to="/register">Student Registration</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4 className="footer-heading">Event Categories</h4>
          <ul className="footer-links">
            <li><Link to="/events?category=Workshop">Workshops & Bootcamps</Link></li>
            <li><Link to="/events?category=Seminar">Technical Seminars</Link></li>
            <li><Link to="/events?category=Hackathon">Hackathons & Coding</Link></li>
            <li><Link to="/events?category=Cultural">Cultural Fests</Link></li>
            <li><Link to="/events?category=Sports">Sports Tournaments</Link></li>
          </ul>
        </div>

        {/* College & Project Info */}
        <div className="footer-col">
          <h4 className="footer-heading">Campus Information</h4>
          <div className="footer-contact-item">
            <MapPin size={16} />
            <span>Campus Innovation Hub & Auditorium Complex</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={16} />
            <span>events@campus.edu</span>
          </div>
          <div className="footer-contact-item">
            <ShieldCheck size={16} />
            <span>Full Stack Academic Project 2026</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p>© 2026 Campus Event Management System. All rights reserved.</p>
          <p className="footer-academic-note">
            Built with Spring Boot REST API & React • Clean, Humanized Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
