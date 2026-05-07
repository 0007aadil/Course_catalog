import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Lesson from './pages/Lesson';
import MyCourses from './pages/MyCourses';
import FacultyDashboard from './pages/FacultyDashboard';

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#f5f5f0',
      fontFamily: 'Inter, sans-serif', color: '#999', fontSize: '0.95rem'
    }}>
      Loading...
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { loading } = useAuth();
  const isLanding = location.pathname === '/';

  if (loading) return <LoadingScreen />;

  return (
    <>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
