import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import CourseEditor from './pages/CourseEditor';
import LessonEditor from './pages/LessonEditor';

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

/* Redirect logged-in users away from auth pages */
function GuestOnly({ children }) {
  const { user } = useAuth();
  if (!user) return children;
  // Redirect based on role
  if (user.role === 'admin' || user.role === 'faculty') return <Navigate to="/faculty" replace />;
  return <Navigate to="/courses" replace />;
}

/* Require authentication */
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* Require admin or faculty role */
function RequireFaculty({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'faculty') return <Navigate to="/courses" replace />;
  return children;
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
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={
          <RequireAuth><Lesson /></RequireAuth>
        } />
        <Route path="/my-courses" element={
          <RequireAuth><MyCourses /></RequireAuth>
        } />
        <Route path="/faculty" element={
          <RequireFaculty><FacultyDashboard /></RequireFaculty>
        } />
        <Route path="/faculty/courses/new" element={
          <RequireFaculty><CourseEditor /></RequireFaculty>
        } />
        <Route path="/faculty/courses/:id/edit" element={
          <RequireFaculty><CourseEditor /></RequireFaculty>
        } />
        <Route path="/faculty/courses/:id/lessons/new" element={
          <RequireFaculty><LessonEditor /></RequireFaculty>
        } />
        <Route path="/faculty/courses/:id/lessons/:lessonId/edit" element={
          <RequireFaculty><LessonEditor /></RequireFaculty>
        } />
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
