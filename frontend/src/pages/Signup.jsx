import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join thousands of learners today</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Choose a username" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Create a password" required />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} placeholder="Confirm password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-btn">Sign Up Free</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
