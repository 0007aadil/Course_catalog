import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'admin' || user.role === 'faculty') {
        navigate('/faculty');
      } else {
        navigate('/courses');
      }
    } catch {
      setError('Invalid username or password.');
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
            Not a member yet? <Link to="/signup">Register now</Link>
          </p>
        </div>
        <div className="auth-card-right">
          <h1 className="auth-title">Log in</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
