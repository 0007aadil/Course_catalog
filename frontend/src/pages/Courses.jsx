import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Courses.css';

const gradients = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #2dd4bf 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #f87171 100%)',
  'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #818cf8 100%)',
  'linear-gradient(135deg, #064e3b 0%, #047857 50%, #34d399 100%)',
];

const icons = ['💻', '🧬', '🎨', '📊', '🚀', '🎯', '🤖', '☁️', '🔒', '📱', '⚙️', '🎓'];

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.list()
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><p>Loading courses...</p></div>;

  return (
    <div className="courses-page">
      <div className="container">
        {/* ── Hero ── */}
        <div className="co-hero animate-up">
          <span className="text-label">Learn from the Best</span>
          <h1 className="co-hero-title">ACADEMY</h1>
          <p className="co-hero-sub">Shape your future in technology and creative coding.</p>
        </div>

        {/* ── Promo Banner ── */}
        <div className="co-promo animate-in" style={{animationDelay:'0.06s'}}>
          <div className="co-promo-content">
            <span className="co-promo-label">Featured</span>
            <h2 className="co-promo-title">Enjoy over {courses.length} Courses<br/>for Digital Learners</h2>
            <p className="co-promo-sub">New courses added every month.</p>
          </div>
          {user ? (
            <a href="#course-grid" className="co-promo-btn">Start Learning!</a>
          ) : (
            <Link to="/signup" className="co-promo-btn">Start Learning!</Link>
          )}
        </div>

        {/* ── Grid ── */}
        {courses.length === 0 ? (
          <div className="co-empty animate-in">
            <h3>No courses yet</h3>
            <p>Check back soon — new content is on its way.</p>
          </div>
        ) : (
          <div id="course-grid" className="co-grid">
            {courses.map((course, i) => (
              <Link
                to={`/courses/${course.id}`}
                key={course.id}
                className="co-card animate-in"
                style={{animationDelay:`${i * 0.05}s`}}
              >
                <div className="card-image" style={{background: gradients[i % gradients.length]}}>
                  <div className="card-image-overlay">
                    <span className="card-icon">{icons[i % icons.length]}</span>
                  </div>
                  <span className="co-card-lessons">{course.lesson_count} lessons</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="co-card-desc">{course.short_description}</p>
                  <div className="co-card-footer">
                    <span className="co-card-instructor">{course.instructor.full_name}</span>
                    <span className="pill pill-dark">Course</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
