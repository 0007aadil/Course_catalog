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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Left: Brand + Links */}
        <div className="navbar-left">
          <Link to={user ? '/courses' : '/'} className="navbar-brand">M.</Link>
          <div className="navbar-links">
            <Link to="/courses" className={`navbar-link ${isActive('/courses') ? 'is-active' : ''}`}>
              Explore
            </Link>
            {user && (
              <Link to="/my-courses" className={`navbar-link ${isActive('/my-courses') ? 'is-active' : ''}`}>
                My Courses
              </Link>
            )}
            {user && (user.role === 'admin' || user.role === 'faculty') && (
              <Link to="/faculty" className={`navbar-link ${isActive('/faculty') ? 'is-active' : ''}`}>
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Right: Auth */}
        <div className="navbar-right">
          {user ? (
            <>
              <div className="navbar-avatar" title={user.username}>
                {(user.first_name?.[0] || user.username[0]).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="navbar-btn-ghost">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn-ghost">Log in</Link>
              <Link to="/signup" className="navbar-btn-fill">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
