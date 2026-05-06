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
      <div className="auth-split animate-in">
        <div className="auth-left">
          <span className="auth-welcome">Welcome!</span>
          <div className="auth-brand-area">
            <span className="auth-brand-logo">M.</span>
            <span className="auth-brand-emoji">😊</span>
          </div>
          <p className="auth-left-footer">Are you a member? <Link to="/login">Log in now</Link></p>
        </div>
        <div className="auth-right">
          <h1 className="auth-title">Register with your e-mail</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field-line">
              <label>USERNAME (*)</label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Username" required />
            </div>
            <div className="field-line">
              <label>EMAIL (*)</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="E-mail" />
            </div>
            <div className="field-row">
              <div className="field-line">
                <label>PASSWORD (*)</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" required />
              </div>
              <div className="field-line">
                <label>REPEAT PASSWORD (*)</label>
                <input type="password" value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} placeholder="Repeat Password" required />
              </div>
            </div>
            <button type="submit" className="auth-submit">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
