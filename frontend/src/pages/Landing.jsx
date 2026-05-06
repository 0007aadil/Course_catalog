import { Link } from 'react-router-dom';
import './Landing.css';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
];

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-brand">M.</span>
          <div className="landing-nav-actions">
            <Link to="/login" className="nav-btn-ghost">Log in</Link>
            <Link to="/signup" className="nav-btn-fill">Sign Up</Link>
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
        <div className="container">
          <div className="featured-grid">
            {[
              { title: 'Python Fundamentals', gradient: gradients[0] },
              { title: 'Web Development', gradient: gradients[1] },
              { title: 'Data Science', gradient: gradients[2] },
            ].map((item, i) => (
              <Link to="/courses" key={i} className="featured-card" style={{animationDelay:`${i*0.1}s`}}>
                <div className="featured-img" style={{background: item.gradient}}>
                  <span className="featured-img-text">{item.title}</span>
                </div>
                <div className="featured-body">
                  <h3>{item.title}</h3>
                  <span className="featured-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
              <p>Explore a curated catalog of courses across multiple disciplines.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Complete lessons and watch your progress grow with clear milestones.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Instructors</h3>
              <p>Learn from faculty through a dedicated instructor dashboard.</p>
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
