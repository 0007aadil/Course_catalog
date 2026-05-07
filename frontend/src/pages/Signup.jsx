import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale">
        <div className="auth-card-left">
          <span className="auth-welcome">Welcome!</span>
          <div className="auth-brand-area">
            <span className="auth-brand-logo">M.</span>
            <span className="auth-brand-emoji">😊</span>
          </div>
          <p className="auth-left-footer">
            Already a member? <Link to="/login">Log in now</Link>
          </p>
        </div>
        <div className="auth-card-right">
          <h1 className="auth-title">Register with your e-mail</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>USERNAME *</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                placeholder="Choose a username"
                required
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label>EMAIL *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="Your email address"
              />
            </div>
            <div className="auth-field-row">
              <div className="auth-field">
                <label>PASSWORD *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Create password"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="auth-field">
                <label>REPEAT PASSWORD *</label>
                <input
                  type="password"
                  value={form.password2}
                  onChange={e => setForm({...form, password2: e.target.value})}
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
