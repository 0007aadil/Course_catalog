import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './FacultyDashboard.css';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.facultyDashboard()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><p>Loading dashboard...</p></div>;
  if (!data) return <div className="page-center"><p>Unable to load dashboard.</p></div>;

  return (
    <div className="fd-page">
      <div className="container">
        {/* ── Header ── */}
        <div className="fd-header animate-in">
          <div>
            <span className="fd-label">Faculty Dashboard</span>
            <h1 className="fd-title">Welcome back, {user?.first_name || user?.username}</h1>
          </div>
          <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="fd-admin-link">
            Open Admin Panel →
          </a>
        </div>

        {/* ── Stats Grid ── */}
        <div className="fd-stats animate-in" style={{animationDelay:'0.05s'}}>
          <div className="fd-stat-card">
            <span className="fd-stat-num">{data.total_courses}</span>
            <span className="fd-stat-label">My Courses</span>
          </div>
          <div className="fd-stat-card">
            <span className="fd-stat-num">{data.total_lessons}</span>
            <span className="fd-stat-label">Total Lessons</span>
          </div>
          <div className="fd-stat-card">
            <span className="fd-stat-num">{data.total_students}</span>
            <span className="fd-stat-label">Enrolled Students</span>
          </div>
        </div>

        {/* ── Courses Table ── */}
        <section className="fd-section animate-in" style={{animationDelay:'0.1s'}}>
          <div className="fd-section-header">
            <h2 className="fd-section-title">Your Courses</h2>
            <span className="fd-section-count">{data.courses.length} courses</span>
          </div>

          {data.courses.length === 0 ? (
            <div className="fd-empty">
              <p>You haven't created any courses yet.</p>
              <a href="http://127.0.0.1:8000/admin/courses/course/add/" target="_blank" rel="noreferrer" className="fd-btn">
                Create First Course
              </a>
            </div>
          ) : (
            <div className="fd-table">
              <div className="fd-table-header">
                <span className="fd-col-name">Course</span>
                <span className="fd-col-lessons">Lessons</span>
                <span className="fd-col-students">Students</span>
                <span className="fd-col-action"></span>
              </div>
              {data.courses.map((course, i) => (
                <div className="fd-table-row" key={course.id} style={{animationDelay:`${i*0.04}s`}}>
                  <div className="fd-col-name">
                    <div className="fd-course-icon">
                      {['💻','🧬','🎨','📊','🚀','🎯','🤖','☁️','🔒','📱','⚙️','🎓'][i % 12]}
                    </div>
                    <div>
                      <span className="fd-course-title">{course.title}</span>
                      <span className="fd-course-desc">{course.short_description}</span>
                    </div>
                  </div>
                  <div className="fd-col-lessons">
                    <span className="fd-pill">{course.lesson_count} lessons</span>
                  </div>
                  <div className="fd-col-students">
                    <span className="fd-pill fd-pill-accent">{course.enrollment_count} enrolled</span>
                  </div>
                  <div className="fd-col-action">
                    <Link to={`/courses/${course.id}`} className="fd-view-btn">View</Link>
                    <a href={`http://127.0.0.1:8000/admin/courses/course/${course.id}/change/`} target="_blank" rel="noreferrer" className="fd-edit-btn">Edit</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
