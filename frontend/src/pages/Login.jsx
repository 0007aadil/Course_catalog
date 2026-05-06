import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(username, password);
      if (user.role === 'admin' || user.role === 'faculty') {
        window.location.href = 'http://127.0.0.1:8000/admin/';
      } else {
        navigate('/courses');
      }
    } catch {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to continue learning</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-btn">Sign In</button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
