import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI, initCsrf } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './CourseDetail.css';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = () => {
    setLoading(true);
    coursesAPI.detail(id)
      .then(res => setCourse(res.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleEnroll = async () => {
    try {
      await initCsrf();
      await coursesAPI.enroll(id);
      fetchCourse();
    } catch (err) {
      alert('Failed to enroll. Please log in first.');
    }
  };

  if (loading) return <div className="container" style={{padding:'4rem 2rem'}}><p style={{color:'#999'}}>Loading...</p></div>;
  if (!course) return <div className="container" style={{padding:'4rem 2rem'}}><p>Course not found.</p></div>;

  const progress = course.lesson_progress || {};

  return (
    <div className="container detail-page">
      <nav className="breadcrumb animate-in">
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <span>{course.title}</span>
      </nav>

      <div className="detail-hero animate-in">
        <div className="instructor-badge">
          <span className="avatar">{course.instructor.full_name.charAt(0)}</span>
          <span>Instructor: {course.instructor.full_name}</span>
        </div>
        <h1 className="detail-title">{course.title}</h1>
        {course.is_enrolled && (
          <span className="enrolled-badge">✓ You are enrolled</span>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-main animate-in" style={{animationDelay:'0.1s'}}>
          <h3 className="section-heading">About this course</h3>
          <p className="detail-desc">{course.long_description}</p>

          <div className="syllabus">
            <div className="syllabus-header">
              <h4>📚 Course Syllabus</h4>
              <span className="tag">{course.lessons.length} lessons</span>
            </div>
            {course.lessons.map((lesson, i) => (
              <div className="syllabus-item" key={lesson.id}>
                {course.is_enrolled ? (
                  <Link to={`/courses/${course.id}/lessons/${lesson.id}`} className="syllabus-link">
                    <span className="lesson-num">{i + 1}</span>
                    <span>{lesson.title}</span>
                  </Link>
                ) : (
                  <div className="syllabus-link disabled">
                    <span className="lesson-num">{i + 1}</span>
                    <span>{lesson.title}</span>
                  </div>
                )}
                {progress[String(lesson.id)] && (
                  <span className="check-badge">✓</span>
                )}
              </div>
            ))}
            {course.lessons.length === 0 && (
              <p className="syllabus-empty">No lessons available yet.</p>
            )}
          </div>
        </div>

        <div className="detail-sidebar animate-in" style={{animationDelay:'0.15s'}}>
          <div className="action-card">
            <h5>Ready to start learning?</h5>
            {!user ? (
              <p className="action-note">
                <Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> to enroll.
              </p>
            ) : !course.is_enrolled ? (
              <>
                <button onClick={handleEnroll} className="btn btn-primary btn-lg" style={{width:'100%'}}>Enroll Now</button>
                <p className="action-sub">Instant access to all lessons.</p>
              </>
            ) : course.lessons.length > 0 ? (
              <Link to={`/courses/${course.id}/lessons/${course.lessons[0].id}`} className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}}>
                Go to First Lesson
              </Link>
            ) : (
              <button className="btn btn-outline btn-lg" style={{width:'100%'}} disabled>Content coming soon</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
