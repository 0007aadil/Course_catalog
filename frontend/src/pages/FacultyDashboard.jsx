import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './FacultyDashboard.css';

const courseIcons = ['💻', '🧬', '🎨', '📊', '🚀', '🎯', '🤖', '☁️', '🔒', '📱', '⚙️', '🎓'];

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
        <div className="fd-header animate-up">
          <div>
            <span className="text-label">Faculty Dashboard</span>
            <h1 className="fd-title">Welcome back, {user?.first_name || user?.username}</h1>
          </div>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            Open Admin Panel →
          </a>
        </div>

        {/* ── Stats ── */}
        <div className="fd-stats animate-in" style={{animationDelay:'0.06s'}}>
          <div className="fd-stat">
            <span className="fd-stat-num">{data.total_courses}</span>
            <span className="fd-stat-label">My Courses</span>
          </div>
          <div className="fd-stat">
            <span className="fd-stat-num">{data.total_lessons}</span>
            <span className="fd-stat-label">Total Lessons</span>
          </div>
          <div className="fd-stat">
            <span className="fd-stat-num">{data.total_students}</span>
            <span className="fd-stat-label">Enrolled Students</span>
          </div>
        </div>

        {/* ── Courses ── */}
        <section className="fd-section animate-in" style={{animationDelay:'0.1s'}}>
          <div className="fd-section-header">
            <h2 className="fd-section-title">Your Courses</h2>
            <span className="text-caption">{data.courses.length} courses</span>
          </div>

          {data.courses.length === 0 ? (
            <div className="fd-empty">
              <div className="my-empty-icon">📝</div>
              <p>You haven't created any courses yet.</p>
              <a
                href="http://127.0.0.1:8000/admin/courses/course/add/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{marginTop:'1rem'}}
              >
                Create First Course
              </a>
            </div>
          ) : (
            <div className="fd-table">
              <div className="fd-table-head">
                <span className="fd-th-course">Course</span>
                <span className="fd-th-lessons">Lessons</span>
                <span className="fd-th-students">Students</span>
                <span className="fd-th-action"></span>
              </div>
              {data.courses.map((course, i) => (
                <div
                  className="fd-table-row animate-in"
                  key={course.id}
                  style={{animationDelay:`${i * 0.04}s`}}
                >
                  <div className="fd-td-course">
                    <div className="fd-course-icon">
                      {courseIcons[i % courseIcons.length]}
                    </div>
                    <div>
                      <span className="fd-course-title">{course.title}</span>
                      <span className="fd-course-desc">{course.short_description}</span>
                    </div>
                  </div>
                  <div className="fd-td-lessons">
                    <span className="pill">{course.lesson_count} lessons</span>
                  </div>
                  <div className="fd-td-students">
                    <span className="pill pill-accent">{course.enrollment_count} enrolled</span>
                  </div>
                  <div className="fd-td-action">
                    <Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline">View</Link>
                    <a
                      href={`http://127.0.0.1:8000/admin/courses/course/${course.id}/change/`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-ghost"
                    >
                      Edit
                    </a>
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
