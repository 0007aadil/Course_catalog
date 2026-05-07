import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { facultyAPI } from '../api/client';
import './CourseEditor.css'; // Reusing the same CSS

export default function LessonEditor() {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isNew = !lessonId;

  const [form, setForm] = useState({ title: '', content: '', order: 1 });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      // Need to fetch the specific lesson details.
      // Use facultyAPI to get the lesson, avoiding enrollment checks
      facultyAPI.getLesson(courseId, lessonId)
        .then(res => {
          setForm({
            title: res.data.title,
            content: res.data.content,
            order: res.data.order,
          });
        })
        .catch(() => setError('Failed to load lesson.'))
        .finally(() => setLoading(false));
    }
  }, [courseId, lessonId, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await facultyAPI.createLesson(courseId, form);
      } else {
        await facultyAPI.updateLesson(courseId, lessonId, form);
      }
      navigate(`/faculty/courses/${courseId}/edit`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save lesson.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await facultyAPI.deleteLesson(courseId, lessonId);
        navigate(`/faculty/courses/${courseId}/edit`);
      } catch {
        alert('Failed to delete lesson.');
      }
    }
  };

  if (loading) return <div className="page-center"><p>Loading...</p></div>;

  return (
    <div className="ce-page">
      <div className="container" style={{maxWidth: '800px'}}>
        <Link to={`/faculty/courses/${courseId}/edit`} className="btn btn-ghost" style={{marginBottom: '1rem'}}>
          ← Back to Course
        </Link>
        
        <div className="ce-card animate-in">
          <div className="ce-header">
            <h1 className="ce-title">{isNew ? 'Add Lesson' : 'Edit Lesson'}</h1>
            {!isNew && (
              <button onClick={handleDelete} className="btn btn-outline" style={{color: 'var(--accent-red)', borderColor: 'var(--accent-red)'}}>
                Delete Lesson
              </button>
            )}
          </div>

          {error && <div className="ce-error">{error}</div>}

          <form onSubmit={handleSubmit} className="ce-form">
            <div className="ce-field">
              <label>Lesson Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. Introduction to Variables"
                required
              />
            </div>
            
            <div className="ce-field">
              <label>Order / Sequence Number</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({...form, order: parseInt(e.target.value) || 1})}
                min="1"
                required
              />
            </div>

            <div className="ce-field">
              <label>Lesson Content (Markdown/Text)</label>
              <textarea
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                placeholder="Write your lesson content here..."
                rows={12}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Lesson'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
