import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './Lesson.css';

export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    coursesAPI.lesson(courseId, lessonId)
      .then(res => setData(res.data))
      .catch(err => {
        if (err.response?.status === 403) setError('You need to enroll in this course first.');
        else if (err.response?.status === 401) setError('Please log in to view lessons.');
        else setError('Failed to load lesson.');
      })
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  if (loading) return <div className="container" style={{padding:'4rem 2rem'}}><p style={{color:'#999'}}>Loading...</p></div>;
  if (error) return (
    <div className="container" style={{padding:'4rem 2rem',textAlign:'center'}}>
      <p style={{marginBottom:'1rem'}}>{error}</p>
      <Link to={`/courses/${courseId}`} className="btn btn-outline">← Back to Course</Link>
    </div>
  );
  if (!data) return null;

  const { lesson, course, all_lessons, lesson_progress } = data;
  const progress = lesson_progress || {};

  return (
    <div className="container lesson-page">
      <nav className="breadcrumb animate-in">
        <Link to="/courses">Courses</Link><span>/</span>
        <Link to={`/courses/${course.id}`}>{course.title}</Link><span>/</span>
        <span>Lesson {lesson.order}</span>
      </nav>
      <div className="lesson-layout">
        <div className="lesson-main animate-in">
          <h1 className="lesson-title">{lesson.title}</h1>
          <span className="completed-badge">✓ Completed</span>
          <div className="lesson-content">
            {lesson.content.split('\n').map((p,i) => p.trim() ? <p key={i}>{p}</p> : null)}
          </div>
          <div style={{marginTop:'2rem',display:'flex',gap:'0.75rem'}}>
            <Link to={`/courses/${course.id}`} className="btn btn-outline">← Back to Course</Link>
          </div>
        </div>
        <div className="lesson-sidebar animate-in" style={{animationDelay:'0.1s'}}>
          <div className="sidebar-card">
            <div className="sidebar-header">📖 Contents</div>
            {all_lessons.map((l,i) => (
              <Link to={`/courses/${course.id}/lessons/${l.id}`} key={l.id} className={`sidebar-item ${l.id === lesson.id ? 'active' : ''}`}>
                <span className="sidebar-num">{i+1}</span>
                <span className="sidebar-title">{l.title}</span>
                {progress[String(l.id)] && <span className="sidebar-check">✓</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
