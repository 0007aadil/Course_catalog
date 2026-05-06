import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './Courses.css';

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
          <p className="page-label">Catalog</p>
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-sub">{courses.length} courses available</p>
        </div>

        {courses.length === 0 ? (
          <div className="empty animate-in">
            <p className="empty-icon">📭</p>
            <h3>No courses yet</h3>
            <p>Check back soon!</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course, i) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="card animate-in" style={{animationDelay:`${i*0.06}s`}}>
                <div className="card-top">
                  <h2 className="card-title">{course.title}</h2>
                  <p className="card-desc">{course.short_description}</p>
                </div>
                <div className="card-bottom">
                  <div className="card-author">
                    <span className="card-avatar">{course.instructor.full_name.charAt(0)}</span>
                    <span className="card-name">{course.instructor.full_name}</span>
                  </div>
                  <span className="card-lessons">{course.lesson_count} lessons</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
