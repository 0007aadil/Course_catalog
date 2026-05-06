import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI, initCsrf } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './CourseDetail.css';

const heroGradients = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #2dd4bf 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
];

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourse = () => {
    setLoading(true);
    coursesAPI.detail(id)
      .then(res => setCourse(res.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await initCsrf();
      await coursesAPI.enroll(id);
      fetchCourse();
    } catch (err) {
      console.error('Enroll error:', err);
      alert('Enrollment failed. Please try again.');
    }
    setEnrolling(false);
  };

  if (loading) return <div className="container" style={{padding:'4rem 2rem'}}><p style={{color:'#999'}}>Loading...</p></div>;
  if (!course) return <div className="container" style={{padding:'4rem 2rem'}}><p>Course not found.</p></div>;

  const progress = course.lesson_progress || {};
  const gradient = heroGradients[(parseInt(id) || 0) % heroGradients.length];

  return (
    <div className="cd-page">
      {/* ── Hero Section ── */}
      <div className="cd-hero">
        <div className="cd-hero-image" style={{background: gradient}}>
          <div className="cd-hero-image-overlay">
            <span className="cd-hero-icon">
              {['💻', '🧬', '🎨', '📊', '🚀'][((parseInt(id) || 0) - 1) % 5]}
            </span>
          </div>
        </div>
        <div className="cd-hero-info">
          {course.is_enrolled && (
            <span className="cd-enrolled-tag">✓ Enrolled</span>
          )}
          <h1 className="cd-hero-title">{course.title}</h1>
          <p className="cd-hero-instructor">
            A course by <strong>{course.instructor.full_name}</strong>
          </p>
          <div className="cd-hero-action">
            {!user ? (
              <Link to="/login" className="cd-btn-enroll">Log in to Enroll</Link>
            ) : !course.is_enrolled ? (
              <button onClick={handleEnroll} className="cd-btn-enroll" disabled={enrolling}>
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            ) : course.lessons.length > 0 ? (
              <Link to={`/courses/${course.id}/lessons/${course.lessons[0].id}`} className="cd-btn-enroll cd-btn-go">
                Start Learning →
              </Link>
            ) : (
              <button className="cd-btn-enroll" disabled>Content coming soon</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Info Bar ── */}
      <div className="container">
        <div className="cd-info-bar animate-in">
          <div className="cd-info-item">
            <span className="cd-info-icon">📜</span>
            <span>CERTIFICATE OF COMPLETION</span>
          </div>
          <div className="cd-info-item">
            <span className="cd-info-icon">📚</span>
            <span>{course.lessons.length} LESSONS</span>
          </div>
          <div className="cd-info-item">
            <span className="cd-info-icon">👤</span>
            <span>BY {course.instructor.full_name.toUpperCase()}</span>
          </div>
        </div>

        {/* ── About ── */}
        <div className="cd-about animate-in" style={{animationDelay: '0.1s'}}>
          <p className="cd-about-text">{course.long_description}</p>
        </div>

        {/* ── Course Content (Table-style) ── */}
        <section className="cd-content animate-in" style={{animationDelay: '0.15s'}}>
          <span className="cd-content-label">Course Content</span>
          <h2 className="cd-content-title">Explore Every<br/>Course Chapter</h2>

          <div className="cd-lessons-table">
            <div className="cd-lessons-header">
              <span className="cd-col-lesson">Lessons</span>
              <span className="cd-col-status">Status</span>
              <span className="cd-col-action"></span>
            </div>

            {course.lessons.map((lesson, i) => {
              const isCompleted = progress[String(lesson.id)];
              return (
                <div className="cd-lesson-row" key={lesson.id}>
                  <div className="cd-col-lesson">
                    <span className="cd-lesson-badge">Lesson {i + 1}</span>
                    <span className="cd-lesson-name">{lesson.title}</span>
                  </div>
                  <div className="cd-col-status">
                    {isCompleted ? (
                      <span className="cd-status-done">✓ Done</span>
                    ) : course.is_enrolled ? (
                      <span className="cd-status-open">Available</span>
                    ) : (
                      <span className="cd-status-locked">🔒</span>
                    )}
                  </div>
                  <div className="cd-col-action">
                    {course.is_enrolled ? (
                      <Link to={`/courses/${course.id}/lessons/${lesson.id}`} className="cd-view-btn">
                        View more
                      </Link>
                    ) : (
                      <span className="cd-view-btn cd-view-disabled">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}

            {course.lessons.length === 0 && (
              <div className="cd-lesson-row">
                <p style={{color:'#999', padding:'1rem 0'}}>No lessons available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Meet the Teacher ── */}
        <section className="cd-teacher animate-in" style={{animationDelay: '0.2s'}}>
          <span className="cd-teacher-label">Meet the teacher</span>
          <h2 className="cd-teacher-name">{course.instructor.full_name.toUpperCase()}</h2>
          <p className="cd-teacher-bio">
            Expert instructor with years of experience in this domain.
            Passionate about creating engaging and comprehensive learning experiences
            that help students build real-world skills.
          </p>
        </section>
      </div>
    </div>
  );
}
