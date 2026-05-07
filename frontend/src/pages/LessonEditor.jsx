import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { facultyAPI } from '../api/client';
import './CourseEditor.css'; // Reusing the same CSS

export default function LessonEditor() {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isNew = !lessonId;

  const [form, setForm] = useState({ title: '', content: '', video_url: '', document_url: '', order: 1 });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isNew) {
      // Need to fetch the specific lesson details.
      // Use facultyAPI to get the lesson, avoiding enrollment checks
      facultyAPI.getLesson(courseId, lessonId)
        .then(res => {
          setForm({
            title: res.data.title || '',
            content: res.data.content || '',
            video_url: res.data.video_url || '',
            document_url: res.data.document_url || '',
            order: res.data.order || 1,
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
    // Convert empty URL strings to null so the backend doesn't reject them
    const payload = {
      ...form,
      video_url: form.video_url?.trim() || null,
      document_url: form.document_url?.trim() || null,
    };
    try {
      if (isNew) {
        await facultyAPI.createLesson(courseId, payload);
      } else {
        await facultyAPI.updateLesson(courseId, lessonId, payload);
      }
      navigate(`/faculty/courses/${courseId}/edit`);
    } catch (err) {
      console.error("Save lesson error:", err.response || err);
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.detail) {
        const messages = Object.entries(err.response.data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
          .join(' | ');
        setError(messages || 'Validation failed.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to save lesson.');
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await facultyAPI.deleteLesson(courseId, lessonId);
      navigate(`/faculty/courses/${courseId}/edit`);
    } catch (err) {
      alert('Failed to delete lesson: ' + (err.response?.data?.detail || err.message));
      console.error(err);
      setConfirmDelete(false);
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
              confirmDelete ? (
                <button type="button" onClick={handleDelete} className="btn" style={{backgroundColor: 'var(--accent-red)', color: '#fff', border: 'none'}}>
                  Click again to confirm
                </button>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="btn btn-outline" style={{color: 'var(--accent-red)', borderColor: 'var(--accent-red)'}}>
                  Delete Lesson
                </button>
              )
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
              <label>Video URL (Optional)</label>
              <input
                type="url"
                value={form.video_url}
                onChange={e => setForm({...form, video_url: e.target.value})}
                placeholder="e.g. https://www.youtube.com/embed/..."
              />
            </div>

            <div className="ce-field">
              <label>Document URL (Optional)</label>
              <input
                type="url"
                value={form.document_url}
                onChange={e => setForm({...form, document_url: e.target.value})}
                placeholder="e.g. https://example.com/document.pdf"
              />
            </div>

            <div className="ce-field">
              <label>Lesson Content (Markdown/Text)</label>
              <textarea
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                placeholder="Write your lesson content here..."
                rows={12}
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
