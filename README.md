# MindPath — MOOC Platform

A full-stack, production-ready MOOC (Massive Open Online Course) platform with a **React** frontend and a **Django REST Framework** backend, connected to a **Neon PostgreSQL** cloud database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7, Axios |
| Backend | Django 4.2, Django REST Framework, Gunicorn |
| Database | Neon PostgreSQL (cloud-hosted serverless Postgres) |
| Proxy / Server | Nginx (production), Vite dev proxy (development) |
| Containerisation | Docker, Docker Compose |
| Admin Panel | Django Jazzmin |

---

## Features

### Students
- Browse and search the course catalog
- One-click enrollment
- Interactive lesson viewer with Markdown content, videos, and documents
- Automatic progress tracking per lesson
- Certificate generation on course completion

### Faculty
- Dedicated dashboard with stats (total courses, students, lessons)
- Create, edit, and delete courses
- Manage lessons with ordering, video URLs, document URLs, and Markdown content

### Admin
- Fully branded "MindPath" admin panel
- Manage users, groups (Faculty / Student), courses, enrollments, and progress

---

## Project Structure

```
Mooc/
├── accounts/              # Auth API (login, signup, logout, CSRF)
│   ├── api_views.py       # REST endpoints for authentication
│   ├── api_urls.py        # URL routing for /api/auth/*
│   └── authentication.py  # Custom CSRF-exempt session auth
├── courses/               # Course & Lesson API
│   ├── models.py          # Course, Lesson, Enrollment, LessonProgress
│   ├── serializers.py     # DRF serializers (read + write)
│   ├── api_views.py       # REST endpoints for courses, lessons, faculty
│   └── api_urls.py        # URL routing for /api/courses/*, /api/faculty/*
├── mooc_project/          # Django project config
│   ├── settings.py        # All settings (DB, CORS, CSRF, Jazzmin, etc.)
│   └── urls.py            # Root URL config
├── frontend/              # React SPA
│   ├── src/
│   │   ├── api/client.js  # Axios client + CSRF handling
│   │   ├── context/       # AuthContext (global auth state)
│   │   ├── components/    # Navbar, shared components
│   │   ├── pages/         # All page components (Login, Courses, etc.)
│   │   └── utils/         # Image mapping utilities
│   ├── Dockerfile         # Multi-stage: Node build → Nginx serve
│   ├── nginx.conf         # Production reverse proxy config
│   └── vite.config.js     # Dev proxy: /api → Django :8000
├── Dockerfile             # Backend: Python 3.11 + Gunicorn
├── docker-compose.yml     # Orchestrates frontend + backend
├── setup_roles.py         # Seed script: creates faculty, courses, lessons
├── requirements.txt       # Python dependencies
├── .env.example           # Template for environment variables
└── .dockerignore          # Keeps Docker images lean
```

---

## Prerequisites

- **Python** 3.9+ and **pip**
- **Node.js** 18+ and **npm**
- **PostgreSQL** (local) or a **Neon** account for cloud DB
- **Docker** and **Docker Compose** (for containerised deployment)

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone git@github.com:0007aadil/Course_catalog.git
cd Course_catalog
```

### 2. Backend setup

```bash
# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### 3. Database setup

```bash
# Run migrations
python3 manage.py migrate

# Create a superuser (admin)
python3 manage.py createsuperuser

# Seed sample faculty accounts and courses
python3 manage.py shell < setup_roles.py
```

### 4. Frontend setup

```bash
cd frontend
npm install
cd ..
```

### 5. Run both servers

Open **two terminal windows**:

```bash
# Terminal 1 — Django backend
python3 manage.py runserver

# Terminal 2 — React frontend
cd frontend && npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## Docker Deployment

Build and run the entire platform with a single command:

```bash
# Build and start
docker compose up --build -d

# Run migrations inside the container
docker compose exec backend python manage.py migrate

# Seed sample data
docker compose exec backend python manage.py shell < setup_roles.py

# View logs
docker compose logs -f

# Stop
docker compose down
```

The app will be available at **http://localhost** (port 80).

---

## Environment Variables

All config is managed via the `.env` file (never committed to git):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgres://localhost:5432/mooc_db` | PostgreSQL connection string |
| `SECRET_KEY` | Production | Auto-generated dev key | Django secret key |
| `DEBUG` | No | `True` | Set to `False` in production |
| `ALLOWED_HOSTS` | Production | `localhost,127.0.0.1` | Comma-separated hostnames |

---

## Default Credentials

After running `setup_roles.py`:

| Role | Username | Password |
|------|----------|----------|
| Faculty | `prof_sharma` | `Faculty123!` |
| Faculty | `prof_gupta` | `Faculty123!` |
| Student | `student1` | `Student123!` |

Create an admin via: `python3 manage.py createsuperuser`

---

## API Endpoints

### Authentication (`/api/auth/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/csrf/` | Set CSRF cookie |
| POST | `/api/auth/login/` | Log in |
| POST | `/api/auth/signup/` | Register |
| POST | `/api/auth/logout/` | Log out |
| GET | `/api/auth/me/` | Current user info + role |

### Courses (`/api/courses/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/` | List all courses |
| GET | `/api/courses/:id/` | Course detail |
| POST | `/api/courses/:id/enroll/` | Enroll in a course |
| GET | `/api/courses/:id/lessons/:id/` | Lesson detail (marks as completed) |
| GET | `/api/my-courses/` | Student's enrolled courses |

### Faculty (`/api/faculty/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty/dashboard/` | Faculty stats |
| POST | `/api/faculty/courses/` | Create course |
| PUT | `/api/faculty/courses/:id/` | Update course |
| DELETE | `/api/faculty/courses/:id/` | Delete course |
| POST | `/api/faculty/courses/:id/lessons/` | Create lesson |
| PUT | `/api/faculty/courses/:id/lessons/:id/` | Update lesson |
| DELETE | `/api/faculty/courses/:id/lessons/:id/` | Delete lesson |

---

## Assumptions & Design Decisions

1. **Session-based auth** was chosen over JWT because the frontend and backend share the same origin (via Vite proxy / Nginx), making HTTP-only session cookies the most secure and simple approach.
2. **Role management** uses Django's built-in `Group` model. A user in the "Faculty" group gets faculty privileges; everyone else is a student by default.
3. **No file uploads** — video and document URLs are stored as links (YouTube, Google Drive, etc.) rather than file uploads. This keeps the infrastructure simple and avoids needing object storage.
4. **Instructor images** are mapped client-side from Unsplash based on the instructor's database ID, not uploaded by the user.
5. **Course fields are flexible** — only the title is strictly required. Short description, long description, lesson content, video URL, and document URL are all optional.
6. **The Neon database** is the single source of truth. Local PostgreSQL is available as a fallback if `DATABASE_URL` is not set.
7. **CSRF protection** is maintained even in the SPA by fetching a CSRF cookie on app initialisation and attaching the token to all mutating requests.

---

## License

This project is for educational purposes.
