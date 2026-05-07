import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Get CSRF token from cookies
function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : '';
}

// Add CSRF token to all mutating requests
api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = getCsrfToken();
  }
  return config;
});

// Fetch CSRF cookie on startup
export async function initCsrf() {
  try {
    await api.get('/auth/csrf/');
  } catch (e) {
    // ignore
  }
}

// Auth
export const authAPI = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  signup: (data) => api.post('/auth/signup/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
};

// Courses
export const coursesAPI = {
  list: () => api.get('/courses/'),
  detail: (id) => api.get(`/courses/${id}/`),
  enroll: (id) => api.post(`/courses/${id}/enroll/`),
  lesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/`),
  myCourses: () => api.get('/my-courses/'),
  facultyDashboard: () => api.get('/faculty/dashboard/'),
};

export default api;
