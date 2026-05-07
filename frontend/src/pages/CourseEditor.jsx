import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { facultyAPI, coursesAPI } from '../api/client';
import './CourseEditor.css';

export default function CourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState({ title: '', short_description: '', long_description: '' });
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      coursesAPI.detail(id)
        .then(res => {
          setForm({
            title: res.data.title,
            short_description: res.data.short_description,
            long_description: res.data.long_description,
          });
          setLessons(res.data.lessons);
        })
        .catch(() => setError('Failed to load course.'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const res = await facultyAPI.createCourse(form);
        navigate(`/faculty/courses/${res.data.id}/edit`);
      } else {
        await facultyAPI.updateCourse(id, form);
        alert('Course saved successfully.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save course.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This cannot be undone.')) {
      try {
        await facultyAPI.deleteCourse(id);
        navigate('/faculty');
      } catch (err) {
        alert('Failed to delete course: ' + (err.response?.data?.detail || err.message));
        console.error(err);
      }
    }
  };

  if (loading) return <div className="page-center"><p>Loading...</p></div>;

  return (
    <div className="ce-page">
      <div className="container" style={{maxWidth: '800px'}}>
        <Link to="/faculty" className="btn btn-ghost" style={{marginBottom: '1rem'}}>
          ← Back to Dashboard
        </Link>
        
        <div className="ce-card animate-in">
          <div className="ce-header">
            <h1 className="ce-title">{isNew ? 'Create New Course' : 'Edit Course'}</h1>
            {!isNew && (
              <button onClick={handleDelete} className="btn btn-outline" style={{color: 'var(--accent-red)', borderColor: 'var(--accent-red)'}}>
                Delete Course
              </button>
            )}
          </div>

          {error && <div className="ce-error">{error}</div>}

          <form onSubmit={handleSubmit} className="ce-form">
            <div className="ce-field">
              <label>Course Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. Python for Beginners"
                required
              />
            </div>
            
            <div className="ce-field">
              <label>Short Description (Max 300 chars)</label>
              <input
                type="text"
                value={form.short_description}
                onChange={e => setForm({...form, short_description: e.target.value})}
                placeholder="A brief summary for the catalog card"
                maxLength={300}
                required
              />
            </div>

            <div className="ce-field">
              <label>Long Description</label>
              <textarea
                value={form.long_description}
                onChange={e => setForm({...form, long_description: e.target.value})}
                placeholder="Full details about what students will learn..."
                rows={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Course Details'}
            </button>
          </form>
        </div>

        {!isNew && (
          <div className="ce-card animate-in" style={{marginTop: '2rem', animationDelay: '0.1s'}}>
            <div className="ce-header">
              <h2 className="ce-title" style={{fontSize: '1.25rem'}}>Lessons</h2>
              <Link to={`/faculty/courses/${id}/lessons/new`} className="btn btn-success btn-sm">
                + Add Lesson
              </Link>
            </div>
            
            {lessons.length === 0 ? (
              <p className="ce-empty">No lessons added yet.</p>
            ) : (
              <div className="ce-lesson-list">
                {lessons.map((lesson, i) => (
                  <div key={lesson.id} className="ce-lesson-row">
                    <div className="ce-lesson-info">
                      <span className="ce-lesson-order">{i + 1}</span>
                      <span className="ce-lesson-title">{lesson.title}</span>
                    </div>
                    <Link to={`/faculty/courses/${id}/lessons/${lesson.id}/edit`} className="btn btn-outline btn-sm">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
