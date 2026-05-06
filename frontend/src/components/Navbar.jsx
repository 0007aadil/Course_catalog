import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to={user ? '/courses' : '/'} className="nav-brand">M.</Link>
          <Link to="/courses" className={isActive('/courses')}>Explore</Link>
          {user && <Link to="/my-courses" className={isActive('/my-courses')}>My Courses</Link>}
          {user && (user.role === 'admin' || user.role === 'faculty') && (
            <a href="http://127.0.0.1:8000/admin/" className="nav-link" target="_blank" rel="noreferrer">Dashboard</a>
          )}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">{user.username}</span>
              <button onClick={handleLogout} className="nav-btn-ghost">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost">Log in</Link>
              <Link to="/signup" className="nav-btn-fill">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
