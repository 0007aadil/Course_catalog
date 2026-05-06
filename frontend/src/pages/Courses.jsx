import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './Courses.css';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.list()
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><p>Loading courses...</p></div>;

  return (
    <div className="courses-page">
      <div className="container">
        <div className="courses-header animate-in">
          <h1 className="courses-title">Learn from the<br/>best instructors.</h1>
        </div>

        {courses.length === 0 ? (
          <div className="empty animate-in">
            <h3>No courses yet</h3>
            <p>Check back soon!</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course, i) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="course-card animate-in" style={{animationDelay:`${i*0.06}s`}}>
                <div className="course-img" style={{background: gradients[i % gradients.length]}}>
                  <span className="course-img-title">{course.title}</span>
                </div>
                <div className="course-body">
                  <h2 className="course-name">{course.title}</h2>
                  <p className="course-desc">{course.short_description}</p>
                  <div className="course-footer">
                    <div className="course-meta">
                      <span className="meta-label">Instructor</span>
                      <span className="meta-value">{course.instructor.full_name}</span>
                    </div>
                    <div className="course-bottom">
                      <span className="course-lessons">{course.lesson_count} lessons</span>
                      <span className="course-arrow">→</span>
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
