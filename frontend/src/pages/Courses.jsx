import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Courses.css';

import { getCourseImage } from '../utils/images';

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
                <div className="card-image" style={{backgroundImage: `url(${getCourseImage(course.id)})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                  <div className="card-image-overlay" style={{background: 'rgba(0,0,0,0.1)'}}>
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
