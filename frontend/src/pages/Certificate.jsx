import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Certificate.css';

export default function Certificate() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.detail(id)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-center"><p>Loading certificate...</p></div>;
  if (!course) return <div className="page-center"><p>Certificate not found.</p></div>;

  const progress = course.lesson_progress || {};
  const allCompleted = Object.values(progress).filter(Boolean).length === course.lessons.length && course.lessons.length > 0;

  if (!allCompleted) {
    return (
      <div className="page-center" style={{flexDirection: 'column', gap: '1rem'}}>
        <h2>Almost there!</h2>
        <p>You must complete all lessons to earn this certificate.</p>
        <Link to={`/courses/${id}`} className="btn btn-primary">Return to Course</Link>
      </div>
    );
  }

  const fullName = user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username;

  return (
    <div className="cert-page animate-in">
      <div className="container" style={{display:'flex',justifyContent:'center',paddingTop:'4rem'}}>
        <div className="cert-container">
          <div className="cert-inner">
            <div className="cert-header">
              <span className="cert-brand">MINDPATH</span>
              <span className="cert-id">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            
            <div className="cert-body">
              <p className="cert-subtitle">This is to certify that</p>
              <h1 className="cert-name">{fullName}</h1>
              <p className="cert-subtitle">has successfully completed the course</p>
              <h2 className="cert-course">{course.title}</h2>
              <p className="cert-date">Awarded on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="cert-footer">
              <div className="cert-sig">
                <div className="sig-name-cursive">{course.instructor.full_name}</div>
                <div className="sig-line"></div>
                <span className="sig-name">{course.instructor.full_name}</span>
                <span className="sig-title">Lead Instructor</span>
              </div>
              <div className="cert-seal">
                🏅
              </div>
              <div className="cert-sig">
                <div className="sig-name-cursive">M. Academy</div>
                <div className="sig-line"></div>
                <span className="sig-name">M. Academy</span>
                <span className="sig-title">Platform Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cert-actions">
        <button onClick={() => window.print()} className="btn btn-primary btn-lg">Download PDF</button>
        <Link to={`/courses/${id}`} className="btn btn-outline btn-lg">Back to Course</Link>
      </div>
    </div>
  );
}
