import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/client';
import './Courses.css';

const cardImages = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
  'linear-gradient(135deg, #2d1b69 0%, #6b21a8 50%, #a855f7 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #2dd4bf 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #f87171 100%)',
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
                <div className="card-image" style={{background: cardImages[i % cardImages.length]}}>
                  <div className="card-image-overlay">
                    <span className="card-image-icon">
                      {['💻', '🧬', '🎨', '📊', '🚀', '🎯'][i % 6]}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">{course.title}</h2>
                  <p className="card-desc">{course.short_description}</p>
                  <div className="card-meta">
                    <div className="card-meta-row">
                      <span className="card-meta-label">Instructor</span>
                      <span className="card-meta-value">{course.instructor.full_name}</span>
                    </div>
                    <div className="card-bottom-row">
                      <div className="card-score">
                        <span className="card-score-text">{course.lesson_count} Lessons</span>
                        <span className="card-score-bar"></span>
                      </div>
                      <span className="card-arrow">→</span>
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
