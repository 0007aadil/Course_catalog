import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './MyCourses.css';

const gradients = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #2dd4bf 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #f87171 100%)',
];

const icons = ['💻', '🧬', '🎨', '📊', '🚀', '🎯'];

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
                <div className="card-image" style={{background: gradients[i % gradients.length]}}>
                  <div className="card-image-overlay">
                    <span className="card-icon">{icons[i % icons.length]}</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{e.course.title}</h3>
                  <p className="my-card-desc">{e.course.short_description}</p>
                  <div className="card-meta">
                    <div className="my-card-row">
                      <span className="my-card-label">Instructor</span>
                      <span className="my-card-value">{e.course.instructor.full_name}</span>
                    </div>
                    <div className="my-card-bottom">
                      <span className="my-card-date">
                        Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                      </span>
                      <span className="my-card-arrow">Continue →</span>
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
