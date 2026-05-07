import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI, initCsrf } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './CourseDetail.css';

import { getCourseImage, getInstructorImage } from '../utils/images';

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

  if (loading) return <div className="page-center"><p>Loading...</p></div>;
  if (!course) return (
    <div className="page-center" style={{flexDirection:'column',gap:'1rem'}}>
      <p>Course not found.</p>
      <Link to="/courses" className="btn btn-outline">← Back to Courses</Link>
    </div>
  );

  const progress = course.lesson_progress || {};
  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <div className="cd-page">
      {/* ── Hero ── */}
      <div className="cd-hero animate-in">
        <div className="cd-hero-image" style={{backgroundImage: `url(${getCourseImage(course.id)})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="card-image-overlay" style={{background: 'rgba(0,0,0,0.2)'}}>
          </div>
        </div>
        <div className="cd-hero-info">
          {course.is_enrolled && <span className="cd-enrolled-badge">✓ Enrolled</span>}
          <h1 className="cd-hero-title">{course.title}</h1>
          <p className="cd-hero-instructor">
            A course by <strong>{course.instructor.full_name}</strong>
          </p>
          <div className="cd-hero-action">
            {!user ? (
              <Link to="/login" className="btn btn-primary btn-lg">Log in to Enroll</Link>
            ) : !course.is_enrolled ? (
              <button onClick={handleEnroll} className="btn btn-primary btn-lg" disabled={enrolling}>
                {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
              </button>
            ) : course.lessons.length > 0 ? (
              <Link to={`/courses/${course.id}/lessons/${course.lessons[0].id}`} className="btn btn-success btn-lg">
                Start Learning →
              </Link>
            ) : (
              <button className="btn btn-outline btn-lg" disabled>Content coming soon</button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Info Bar ── */}
        <div className="cd-info-bar animate-in" style={{animationDelay:'0.06s'}}>
          <div className="cd-info-item">
            <span className="cd-info-icon">📜</span>
            <span>Certificate of Completion</span>
          </div>
          <div className="cd-info-item">
            <span className="cd-info-icon">📚</span>
            <span>{course.lessons.length} Lessons</span>
          </div>
          <div className="cd-info-item">
            <span className="cd-info-icon">👤</span>
            <span>By {course.instructor.full_name}</span>
          </div>
          {course.is_enrolled && course.lessons.length > 0 && (
            <div className="cd-info-item">
              <span className="cd-info-icon">📈</span>
              <span>{completedCount}/{course.lessons.length} Completed</span>
            </div>
          )}
        </div>

        {/* ── About ── */}
        <div className="cd-about animate-in" style={{animationDelay:'0.1s'}}>
          <h2 className="cd-about-heading">About this course</h2>
          <p className="cd-about-text">{course.long_description}</p>
        </div>

        {/* ── Lessons ── */}
        <section className="cd-lessons animate-in" style={{animationDelay:'0.14s'}}>
          <div className="cd-lessons-header">
            <div>
              <span className="text-label">Course Content</span>
              <h2 className="cd-lessons-title">Explore Every Chapter</h2>
            </div>
            <span className="text-caption">{course.lessons.length} lessons</span>
          </div>

          <div className="cd-lessons-table">
            <div className="cd-lessons-table-head">
              <span className="cd-col-lesson">Lesson</span>
              <span className="cd-col-status">Status</span>
              <span className="cd-col-action"></span>
            </div>

            {course.lessons.map((lesson, i) => {
              const done = progress[String(lesson.id)];
              return (
                <div className="cd-lesson-row" key={lesson.id} style={{animationDelay:`${i * 0.03}s`}}>
                  <div className="cd-col-lesson">
                    <span className="cd-lesson-num">Lesson {i + 1}</span>
                    <span className="cd-lesson-name">{lesson.title}</span>
                  </div>
                  <div className="cd-col-status">
                    {done ? (
                      <span className="pill pill-accent">✓ Done</span>
                    ) : course.is_enrolled ? (
                      <span className="pill">Available</span>
                    ) : (
                      <span className="pill pill-outline">🔒 Locked</span>
                    )}
                  </div>
                  <div className="cd-col-action">
                    {course.is_enrolled ? (
                      <Link to={`/courses/${course.id}/lessons/${lesson.id}`} className="btn btn-sm btn-outline">
                        View →
                      </Link>
                    ) : (
                      <span className="btn btn-sm btn-ghost" style={{opacity:0.4,cursor:'default'}}>Locked</span>
                    )}
                  </div>
                </div>
              );
            })}

            {course.lessons.length === 0 && (
              <div className="cd-lesson-row">
                <p className="text-caption" style={{padding:'1rem 0'}}>No lessons available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Teacher ── */}
        <section className="cd-teacher animate-in" style={{animationDelay:'0.18s'}}>
          <div className="cd-teacher-content">
            <div className="cd-teacher-info">
              <span className="text-label">Meet the teacher</span>
              <h2 className="cd-teacher-name">{course.instructor.full_name}</h2>
              <p className="cd-teacher-bio">
                Expert instructor with years of experience in this domain.
                Passionate about creating engaging and comprehensive learning experiences
                that help students build real-world skills.
              </p>
            </div>
            <div className="cd-teacher-image-wrapper">
              <img 
                src={getInstructorImage(course.instructor.id)} 
                alt={course.instructor.full_name} 
                className="cd-teacher-image" 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
