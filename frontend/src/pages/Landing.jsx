import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../api/client';
import { getCourseImage } from '../utils/images';
import './Landing.css';

const stats = [
  { num: '50+', label: 'Courses' },
  { num: '200+', label: 'Lessons' },
  { num: '1K+', label: 'Students' },
  { num: '10+', label: 'Instructors' },
];

export default function Landing() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    coursesAPI.list()
      .then(res => setFeatured(res.data.slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-brand">M.</span>
          <div className="landing-nav-actions">
            {user ? (
              <>
                <Link to="/courses" className="navbar-btn-ghost">Courses</Link>
                <Link to="/my-courses" className="navbar-btn-ghost">My Learning</Link>
                <button onClick={handleLogout} className="navbar-btn-fill" style={{border:'none',cursor:'pointer',fontFamily:'inherit'}}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-btn-ghost">Log in</Link>
                <Link to="/signup" className="navbar-btn-fill">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="l-hero">
        <div className="l-hero-label animate-up">
          Course Platform <span className="l-hero-tag">Open for Enrollment</span>
        </div>
        <h1 className="l-hero-title animate-up" style={{animationDelay:'0.08s'}}>
          MindPath
        </h1>
        <p className="l-hero-desc animate-up" style={{animationDelay:'0.16s'}}>
          Discover expert-led courses, track your progress, and build skills that matter — all in one beautifully simple place.
        </p>
        <div className="l-hero-ctas animate-up" style={{animationDelay:'0.24s'}}>
          <Link to={user ? '/courses' : '/signup'} className="btn btn-primary btn-lg">
            {user ? 'Browse Courses' : 'Get Started'}
          </Link>
          <Link to="/courses" className="btn btn-outline btn-lg">Explore Catalog</Link>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="l-featured">
        <div className="container">
          <h2 className="l-section-title animate-in">
            Learn from the<br/>best instructors.
          </h2>
          <div className="l-featured-grid">
            {featured.map((c, i) => (
              <Link to={`/courses/${c.id}`} key={c.id} className="l-card animate-in" style={{animationDelay:`${i * 0.08}s`}}>
                <div className="card-image" style={{backgroundImage: `url(${getCourseImage(c.id)})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{c.title}</h3>
                  <div className="card-meta">
                    <div className="l-card-row">
                      <span className="l-card-label">Instructor</span>
                      <span className="l-card-value">{c.instructor.full_name}</span>
                    </div>
                    <div className="l-card-bottom">
                      <div className="score">
                        <span className="score-text">Score 5.0/5</span>
                        <span className="score-bar"></span>
                      </div>
                      <span className="l-card-arrow">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="l-view-all animate-in" style={{animationDelay: '0.3s'}}>
            <span>Choose from over <strong>hundreds</strong> of courses</span>
            <Link to="/courses" className="l-view-all-link">→ View Academy</Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="container">
        <div className="l-stats animate-in">
          {stats.map((s, i) => (
            <div className="l-stat" key={i}>
              <div className="l-stat-num">{s.num}</div>
              <div className="l-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Cards ── */}
      <section className="l-cta-section">
        <div className="container">
          <div className="l-cta-grid">
            <div className="l-cta-card">
              <span className="l-cta-label">Start learning</span>
              <h2 className="l-cta-title">Browse our curated<br/>course catalog</h2>
              <Link to="/courses" className="l-cta-btn">Explore Courses</Link>
              <p className="l-cta-faq">Need help? <Link to="/signup">Create an account</Link></p>
            </div>
            <div className="l-cta-card">
              <span className="l-cta-label">Join us</span>
              <h2 className="l-cta-title">Get access to all<br/>courses for free</h2>
              <Link to="/signup" className="l-cta-btn">Sign Up Free</Link>
              <p className="l-cta-faq">Already a member? <Link to="/login">Log in</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="l-footer">
        <div className="container">
          <div className="l-footer-inner">
            <span className="l-footer-brand">M.</span>
            <p className="l-footer-copy">© 2026 MindPath. Built for learners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
