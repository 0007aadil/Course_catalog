import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './MyCourses.css';

import { getCourseImage } from '../utils/images';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.myCourses()
      .then(res => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><p>Loading your courses...</p></div>;

  return (
    <div className="my-page">
      <div className="container">
        {/* ── Header ── */}
        <div className="my-header animate-up">
          <div>
            <span className="text-label">Your Progress</span>
            <h1 className="my-title">My Learning</h1>
          </div>
          <span className="my-count">
            {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled
          </span>
        </div>

        {/* ── Empty State ── */}
        {enrollments.length === 0 ? (
          <div className="my-empty animate-in">
            <div className="my-empty-icon">📚</div>
            <h3>Your learning journey starts here</h3>
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary btn-lg" style={{marginTop:'1.25rem'}}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="my-grid">
            {enrollments.map((e, i) => (
              <Link
                to={`/courses/${e.course.id}`}
                key={e.id}
                className="my-card animate-in"
                style={{animationDelay:`${i * 0.05}s`}}
              >
                <div className="card-image" style={{backgroundImage: `url(${getCourseImage(e.course.id)})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{e.course.title}</h3>
                  <p className="my-card-desc">{e.course.short_description}</p>
                  <div className="card-meta">
                    <div className="my-card-row">
                      <span className="my-card-label">Instructor</span>
                      <span className="my-card-value">{e.course.instructor.full_name}</span>
                    </div>
                    <div className="my-card-progress">
                      <div className="progress-text">
                        <span>{e.completed_lessons_count || 0} of {e.course.lesson_count || 0} lessons completed</span>
                        <span>
                          {e.course.lesson_count > 0 
                            ? Math.round(((e.completed_lessons_count || 0) / e.course.lesson_count) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{width: `${e.course.lesson_count > 0 ? ((e.completed_lessons_count || 0) / e.course.lesson_count) * 100 : 0}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="my-card-bottom" style={{marginTop: '0.75rem'}}>
                      {e.completed_lessons_count === e.course.lesson_count && e.course.lesson_count > 0 ? (
                        <span className="my-card-arrow" style={{color: 'var(--accent-green)'}}>View Certificate →</span>
                      ) : (
                        <span className="my-card-arrow">Continue →</span>
                      )}
                    </div>
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
