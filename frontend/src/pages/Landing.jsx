import { Link } from 'react-router-dom';
import './Landing.css';

const featuredCourses = [
  { 
    title: 'Web Development with Django', 
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    icon: '💻',
    instructor: 'Rajesh Sharma',
    score: '4.8'
  },
  { 
    title: 'Python for Data Science', 
    bg: 'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
    icon: '🧬',
    instructor: 'Priya Gupta',
    score: '4.9'
  },
  { 
    title: 'Machine Learning Basics', 
    bg: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
    icon: '🤖',
    instructor: 'Expert Faculty',
    score: '5.0'
  },
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
          <h2 className="section-heading">Learn from the<br/>best instructors.</h2>
          <div className="featured-grid">
            {featuredCourses.map((course, i) => (
              <Link to="/courses" key={i} className="f-card" style={{animationDelay:`${i*0.1}s`}}>
                <div className="f-card-image" style={{background: course.bg}}>
                  <div className="f-card-image-overlay">
                    <span className="f-card-icon">{course.icon}</span>
                  </div>
                </div>
                <div className="f-card-body">
                  <h3 className="f-card-title">{course.title}</h3>
                  <div className="f-card-meta">
                    <div className="f-card-meta-row">
                      <span className="f-card-label">Instructor</span>
                      <span className="f-card-value">{course.instructor}</span>
                    </div>
                    <div className="f-card-bottom">
                      <div className="f-card-score">
                        <span className="f-card-score-text">Score {course.score}/5</span>
                        <span className="f-card-score-bar"></span>
                      </div>
                      <span className="f-card-arrow">→</span>
                    </div>
                  </div>
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
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3>Browse Courses</h3>
              <p>Explore a curated catalog of courses across multiple disciplines.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
                </svg>
              </div>
              <h3>Track Progress</h3>
              <p>Complete lessons and watch your progress grow with clear milestones.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
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
