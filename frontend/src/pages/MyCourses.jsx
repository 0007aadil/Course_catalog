import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './MyCourses.css';

const cardImages = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #2dd4bf 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #f87171 100%)',
];

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.myCourses()
      .then(res => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><p>Loading...</p></div>;

  return (
    <div className="my-page">
      <div className="container">
        <div className="my-header animate-in">
          <h1 className="my-title">My Learning</h1>
          <p className="my-sub">{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</p>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty animate-in">
            <h3>Your learning journey starts here</h3>
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary btn-lg" style={{marginTop:'1.5rem'}}>Browse Courses</Link>
          </div>
        ) : (
          <div className="my-grid">
            {enrollments.map((e, i) => (
              <Link to={`/courses/${e.course.id}`} key={e.id} className="my-card animate-in" style={{animationDelay:`${i*0.06}s`}}>
                <div className="card-image" style={{background: cardImages[i % cardImages.length]}}>
                  <div className="card-image-overlay">
                    <span className="card-image-icon">
                      {['💻', '🧬', '🎨', '📊', '🚀', '🎯'][i % 6]}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">{e.course.title}</h2>
                  <p className="card-desc">{e.course.short_description}</p>
                  <div className="card-meta">
                    <div className="card-meta-row">
                      <span className="card-meta-label">Instructor</span>
                      <span className="card-meta-value">{e.course.instructor.full_name}</span>
                    </div>
                    <div className="card-bottom-row">
                      <span className="my-enrolled-date">Enrolled {new Date(e.enrolled_at).toLocaleDateString()}</span>
                      <span className="card-arrow">Continue →</span>
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
