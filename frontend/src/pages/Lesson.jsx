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

  if (loading) return <div className="page-center"><p>Loading lesson...</p></div>;

  if (error) return (
    <div className="page-center" style={{flexDirection:'column',gap:'1rem'}}>
      <p>{error}</p>
      <Link to={`/courses/${courseId}`} className="btn btn-outline">← Back to Course</Link>
    </div>
  );

  if (!data) return null;

  const { lesson, course, all_lessons, lesson_progress } = data;
  const progress = lesson_progress || {};
  const currentIdx = all_lessons.findIndex(l => l.id === lesson.id);
  const nextLesson = all_lessons[currentIdx + 1];
  const prevLesson = all_lessons[currentIdx - 1];
  const allCompleted = Object.values(progress).filter(Boolean).length === all_lessons.length;

  return (
    <div className="lesson-page">
      <div className="container">
        {/* ── Breadcrumb ── */}
        <nav className="ls-breadcrumb animate-in">
          <Link to="/courses">Courses</Link>
          <span className="ls-breadcrumb-sep">/</span>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
          <span className="ls-breadcrumb-sep">/</span>
          <span className="ls-breadcrumb-current">Lesson {lesson.order}</span>
        </nav>

        <div className="ls-layout">
          {/* ── Main Content ── */}
          <main className="ls-main animate-in">
            <div className="ls-main-header">
              <span className="pill pill-accent">✓ Completed</span>
              <h1 className="ls-title">{lesson.title}</h1>
            </div>

            {lesson.id % 2 !== 0 && (
              <div className="ls-video-container">
                <iframe 
                  src="https://www.youtube.com/embed/bJzb-RuUcMU?rel=0&modestbranding=1" 
                  title="Lesson Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="ls-content">
              {lesson.content.split('\n').map((p, i) =>
                p.trim() ? <p key={i}>{p}</p> : null
              )}
            </div>

            {/* ── Nav buttons ── */}
            <div className="ls-nav-buttons">
              {prevLesson ? (
                <Link to={`/courses/${course.id}/lessons/${prevLesson.id}`} className="btn btn-outline">
                  ← Previous
                </Link>
              ) : (
                <span></span>
              )}
              <Link to={`/courses/${course.id}`} className="btn btn-ghost">Back to Course</Link>
              {nextLesson ? (
                <Link to={`/courses/${course.id}/lessons/${nextLesson.id}`} className="btn btn-primary">
                  Next Lesson →
                </Link>
              ) : allCompleted ? (
                <Link to={`/courses/${course.id}/certificate`} className="btn btn-success" style={{animation: 'pulse 2s infinite'}}>
                  View Certificate
                </Link>
              ) : (
                <span className="btn btn-ghost" style={{pointerEvents:'none'}}>Course Complete!</span>
              )}
            </div>
          </main>

          {/* ── Sidebar ── */}
          <aside className="ls-sidebar animate-in" style={{animationDelay:'0.08s'}}>
            <div className="ls-sidebar-card">
              <div className="ls-sidebar-header">
                <span>📖</span>
                <span>Course Contents</span>
              </div>
              <div className="ls-sidebar-progress">
                <div className="ls-progress-bar">
                  <div
                    className="ls-progress-fill"
                    style={{width: `${(Object.values(progress).filter(Boolean).length / all_lessons.length) * 100}%`}}
                  ></div>
                </div>
                <span className="ls-progress-text">
                  {Object.values(progress).filter(Boolean).length}/{all_lessons.length} completed
                </span>
              </div>
              {all_lessons.map((l, i) => (
                <Link
                  to={`/courses/${course.id}/lessons/${l.id}`}
                  key={l.id}
                  className={`ls-sidebar-item ${l.id === lesson.id ? 'is-active' : ''}`}
                >
                  <span className="ls-sidebar-num">{i + 1}</span>
                  <span className="ls-sidebar-title">{l.title}</span>
                  {progress[String(l.id)] && <span className="ls-sidebar-check">✓</span>}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
