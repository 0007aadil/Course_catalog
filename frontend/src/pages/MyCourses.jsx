import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './MyCourses.css';

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
          <p className="page-label">Dashboard</p>
          <h1 className="page-title">My Learning</h1>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty animate-in">
            <h3>No courses yet</h3>
            <p>You haven't enrolled in any courses.</p>
            <Link to="/courses" className="nav-btn-fill" style={{display:'inline-block',marginTop:'1rem',padding:'0.6rem 1.5rem',borderRadius:'8px',textDecoration:'none',color:'#fff',background:'#1a1a1a',fontWeight:600,fontSize:'0.9rem'}}>Browse Courses</Link>
          </div>
        ) : (
          <div className="my-list">
            {enrollments.map((e, i) => (
              <Link to={`/courses/${e.course.id}`} key={e.id} className="my-card animate-in" style={{animationDelay:`${i*0.05}s`}}>
                <div className="my-card-info">
                  <h3>{e.course.title}</h3>
                  <p>{e.course.short_description}</p>
                  <span className="my-meta">{e.course.instructor.full_name} · Enrolled {new Date(e.enrolled_at).toLocaleDateString()}</span>
                </div>
                <span className="my-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
