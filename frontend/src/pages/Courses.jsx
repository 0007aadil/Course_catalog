import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Courses.css';

const cardImages = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #2dd4bf 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #f87171 100%)',
];

const icons = ['💻', '🧬', '🎨', '📊', '🚀', '🎯'];

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
        {/* ── Hero Header ── */}
        <div className="courses-hero animate-in">
          <span className="courses-label">Learn from the Best</span>
          <h1 className="courses-heading">ACADEMY</h1>
          <p className="courses-sub">Shape your future in technology and creative coding.</p>
        </div>

        {/* ── Promo Banner ── */}
        <div className="courses-promo animate-in" style={{animationDelay:'0.05s'}}>
          <span className="promo-label">Learn from the Best</span>
          <h2 className="promo-title">Enjoy over {courses.length} Courses<br/>for Digital Learners</h2>
          <p className="promo-sub">New courses added every month.</p>
          {user ? (
            <a href="#course-grid" className="promo-btn">Start Learning!</a>
          ) : (
            <Link to="/signup" className="promo-btn">Start Learning!</Link>
          )}
        </div>

        {/* ── Course Grid ── */}
        {courses.length === 0 ? (
          <div className="empty animate-in">
            <h3>No courses yet</h3>
            <p>Check back soon!</p>
          </div>
        ) : (
          <div id="course-grid" className="course-grid animate-in" style={{animationDelay:'0.1s'}}>
            {courses.map((course, i) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="c-card" style={{animationDelay:`${i*0.06}s`}}>
                <div className="c-card-img" style={{background: cardImages[i % cardImages.length]}}>
                  <span className="c-card-icon">{icons[i % icons.length]}</span>
                  <span className="c-card-tag">{course.lesson_count} lessons</span>
                </div>
                <div className="c-card-body">
                  <h3 className="c-card-title">{course.title}</h3>
                  <div className="c-card-meta">
                    <span className="c-card-instructor">{course.instructor.full_name}</span>
                    <span className="c-card-badge">Course</span>
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
