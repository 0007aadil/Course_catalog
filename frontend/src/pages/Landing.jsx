import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-brand">W.</span>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/signup" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-label">
          Course Platform <span className="hero-tag">Open for Enrollment</span>
        </div>
        <h1 className="hero-title">MOOC<br/>Catalog</h1>
        <p className="hero-desc">
          Discover expert-led courses, track your progress, and build skills that matter — all in one beautifully simple place.
        </p>
        <div className="hero-ctas">
          <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/courses" className="btn btn-outline btn-lg">Browse Courses</Link>
        </div>
      </section>

      <section className="featured-section">
        <Link to="/courses" className="featured-card">
          <div className="featured-img">
            <span className="featured-img-text">Explore →</span>
          </div>
          <div className="featured-body">
            <div>
              <h3 className="featured-title">Course Catalog</h3>
              <p className="featured-sub">Browse all available courses and start learning today.</p>
            </div>
            <div className="featured-tags">
              <span className="tag">Courses</span>
              <span className="tag">Free</span>
            </div>
          </div>
        </Link>
      </section>

      <div className="container">
        <div className="stats-bar">
          <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Courses</div></div>
          <div className="stat"><div className="stat-num">200+</div><div className="stat-label">Lessons</div></div>
          <div className="stat"><div className="stat-num">1K+</div><div className="stat-label">Students</div></div>
          <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Instructors</div></div>
        </div>
      </div>

      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Why MOOC Catalog</h2>
            <p className="features-sub">Everything you need to start your learning journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Browse Courses</h3>
              <p>Explore a curated catalog across multiple disciplines.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Complete lessons and watch your progress grow.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Instructors</h3>
              <p>Learn from faculty through dedicated dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready to start?</h2>
        <p className="cta-desc">Create a free account. No credit card required.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">Create Account</Link>
      </section>

      <footer className="landing-footer">
        <p>© 2026 MOOC Catalog. Built for learners.</p>
      </footer>
    </div>
  );
}
