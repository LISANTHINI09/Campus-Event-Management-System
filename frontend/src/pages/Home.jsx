import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Award, 
  GraduationCap, 
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Technical', desc: 'Coding contests, tech talks & hackathons' },
  { name: 'Workshop', desc: 'Hands-on practical development bootcamps' },
  { name: 'Seminar', desc: 'Industry insights and expert lectures' },
  { name: 'Cultural', desc: 'Music, dance, drama & college fest' },
  { name: 'Sports', desc: 'Inter-department athletic tournaments' },
  { name: 'Hackathon', desc: '24-hour innovation & problem solving' },
];

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        const events = await eventService.getEvents({ status: 'UPCOMING' });
        setFeaturedEvents(events.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeEvents();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={16} className="hero-pill-icon" />
              <span>Official Campus Event Portal 2026</span>
            </div>
            <h1 className="hero-title">
              Discover, Participate & Excel in <span className="highlight-text">Campus Events</span>
            </h1>
            <p className="hero-subtitle">
              Your centralized digital portal for workshops, tech hackathons, cultural festivals,
              and athletic competitions across all college departments.
            </p>

            <div className="hero-cta-group">
              <Link to="/events" className="btn btn-primary btn-lg">
                <span>Browse All Events</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                <span>Student Sign Up</span>
              </Link>
            </div>

            {/* Quick Stat Highlights */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="hero-stat-num">10+</span>
                <span className="hero-stat-label">Live Events</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-num">8+</span>
                <span className="hero-stat-label">Departments</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-num">100%</span>
                <span className="hero-stat-label">Real-time Slots</span>
              </div>
            </div>
          </div>

          <div className="hero-banner-card">
            <div className="hero-card-header">
              <div className="hero-card-icon-box">
                <GraduationCap size={28} />
              </div>
              <div>
                <h4>Campus Activity Hub</h4>
                <p>Spring Boot & React Full Stack</p>
              </div>
            </div>
            <div className="hero-card-list">
              <div className="hero-card-feature">
                <CheckCircle2 size={18} className="text-primary" />
                <span>One-click event registration for students</span>
              </div>
              <div className="hero-card-feature">
                <CheckCircle2 size={18} className="text-primary" />
                <span>Live seat counts and registration deadlines</span>
              </div>
              <div className="hero-card-feature">
                <CheckCircle2 size={18} className="text-primary" />
                <span>Comprehensive Admin management console</span>
              </div>
              <div className="hero-card-feature">
                <CheckCircle2 size={18} className="text-primary" />
                <span>Instant cancellation & slot re-allocation</span>
              </div>
            </div>
            <div className="hero-card-footer">
              <Link to="/login" className="btn btn-primary btn-sm full-width">
                Coordinator Login Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Explore by Event Category</h2>
            <p className="section-subtitle">
              Browse campus activities tailored to your departmental and extracurricular interests.
            </p>
          </div>

          <div className="category-cards-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="category-card card"
                onClick={() => navigate(`/events?category=${cat.name}`)}
              >
                <div className="category-card-top">
                  <span className="badge badge-category">{cat.name}</span>
                  <Compass size={18} className="category-arrow" />
                </div>
                <h4 className="category-title">{cat.name}</h4>
                <p className="category-desc">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="featured-events-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Upcoming Campus Events</h2>
              <p className="section-subtitle">Reserve your seat before registration deadlines close.</p>
            </div>
            <Link to="/events" className="btn btn-secondary btn-sm">
              <span>View All Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured upcoming events..." />
          ) : (
            <div className="event-grid">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works / Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Simple 3-Step Process</h2>
            <p className="section-subtitle">How students effortlessly engage in campus events.</p>
          </div>

          <div className="process-grid">
            <div className="process-card card">
              <div className="process-step-num">01</div>
              <h4>Browse & Filter</h4>
              <p>Explore upcoming workshops, hackathons, and symposiums by category and date.</p>
            </div>

            <div className="process-card card">
              <div className="process-step-num">02</div>
              <h4>1-Click Register</h4>
              <p>Register with your student profile. Seats and registration deadline are verified instantly.</p>
            </div>

            <div className="process-card card">
              <div className="process-step-num">03</div>
              <h4>Attend & Excel</h4>
              <p>Track your registered events in your student dashboard and participate on the big day.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
