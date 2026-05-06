import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './MyCourses.css';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
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
                <div className="my-card-img" style={{background: gradients[i % gradients.length]}}>
                  <span className="my-card-img-text">{e.course.title}</span>
                </div>
                <div className="my-card-body">
                  <h3>{e.course.title}</h3>
                  <p>{e.course.short_description}</p>
                  <div className="my-card-footer">
                    <div className="my-card-meta">
                      <span className="meta-label">Instructor</span>
                      <span className="meta-value">{e.course.instructor.full_name}</span>
                    </div>
                    <div className="my-card-bottom">
                      <span className="enrolled-date">Enrolled {new Date(e.enrolled_at).toLocaleDateString()}</span>
                      <span className="continue-arrow">Continue →</span>
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
