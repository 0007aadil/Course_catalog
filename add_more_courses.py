"""
Seed script to add more faculty and courses.
Run with: python3 manage.py shell < add_more_courses.py
"""
from django.contrib.auth.models import User, Group
from courses.models import Course, Lesson

faculty_group = Group.objects.get(name='Faculty')

# ============================================================
# 1. New Faculty Members
# ============================================================
new_faculty = [
    {
        'username': 'prof_verma',
        'email': 'verma@university.com',
        'password': 'Faculty123!',
        'first_name': 'Ankit',
        'last_name': 'Verma',
    },
    {
        'username': 'prof_iyer',
        'email': 'iyer@university.com',
        'password': 'Faculty123!',
        'first_name': 'Meera',
        'last_name': 'Iyer',
    },
    {
        'username': 'prof_khan',
        'email': 'khan@university.com',
        'password': 'Faculty123!',
        'first_name': 'Arif',
        'last_name': 'Khan',
    },
]

for data in new_faculty:
    user, created = User.objects.get_or_create(
        username=data['username'],
        defaults={
            'email': data['email'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'is_staff': True,
            'is_superuser': False,
        }
    )
    if created:
        user.set_password(data['password'])
        user.save()
        user.groups.add(faculty_group)
        print(f"Created faculty: {data['first_name']} {data['last_name']}")
    else:
        print(f"Already exists: {data['username']}")

# ============================================================
# 2. New Courses
# ============================================================
prof_verma = User.objects.get(username='prof_verma')
prof_iyer = User.objects.get(username='prof_iyer')
prof_khan = User.objects.get(username='prof_khan')
prof_sharma = User.objects.get(username='prof_sharma')
prof_gupta = User.objects.get(username='prof_gupta')

courses_to_create = [
    # ── Prof Verma (UI/UX + Frontend) ──
    {
        'instructor': prof_verma,
        'title': 'UI/UX Design Fundamentals',
        'short_description': 'Master user-centered design, wireframing, prototyping, and design systems.',
        'long_description': 'This course teaches you the complete UI/UX design process — from user research and personas to wireframes, high-fidelity mockups, and interactive prototypes. You will learn industry tools and build a portfolio-ready case study.',
        'lessons': [
            ('Introduction to UI/UX Design', 'Understand the difference between UI and UX. Explore the design thinking process, empathy maps, and user personas. Learn why great design starts with understanding people, not pixels.'),
            ('User Research & Information Architecture', 'Learn qualitative and quantitative research methods — surveys, interviews, usability tests. Organize content with card sorting and create sitemaps and user flows.'),
            ('Wireframing & Low-Fidelity Prototyping', 'Sketch wireframes by hand and digitally. Learn layout principles, content hierarchy, and create clickable low-fidelity prototypes using Figma.'),
            ('Visual Design & Design Systems', 'Master typography, color theory, spacing, and grid systems. Build a reusable component library and create a cohesive design system from scratch.'),
            ('Usability Testing & Iteration', 'Conduct usability tests, analyze feedback, and iterate on your designs. Learn A/B testing, heatmaps, and how to present design decisions to stakeholders.'),
        ],
    },
    {
        'instructor': prof_verma,
        'title': 'Advanced CSS & Animations',
        'short_description': 'Create stunning interfaces with modern CSS — Grid, Flexbox, transitions, and keyframe animations.',
        'long_description': 'Go beyond the basics of CSS. This course covers CSS Grid, Flexbox, custom properties, responsive design patterns, smooth transitions, complex keyframe animations, and performance optimization for production.',
        'lessons': [
            ('CSS Grid Mastery', 'Learn CSS Grid from scratch — grid-template, fr units, auto-fill, minmax, and named grid areas. Build complex responsive layouts without a single media query.'),
            ('Flexbox Deep Dive', 'Master Flexbox alignment, wrapping, ordering, and nested flex containers. Solve real-world layout challenges like sticky footers and centered cards.'),
            ('Transitions & Transforms', 'Add polish with CSS transitions. Learn timing functions, transform origins, 3D transforms, and how to chain multiple transitions for smooth interactions.'),
            ('Keyframe Animations', 'Create complex multi-step animations with @keyframes. Learn animation-fill-mode, delays, iteration counts, and build loading spinners, reveals, and parallax effects.'),
        ],
    },

    # ── Prof Iyer (Data & AI) ──
    {
        'instructor': prof_iyer,
        'title': 'Machine Learning with Python',
        'short_description': 'Build intelligent systems — regression, classification, clustering, and neural networks.',
        'long_description': 'A hands-on introduction to machine learning using scikit-learn and TensorFlow. You will implement real ML algorithms, evaluate model performance, and deploy a trained model.',
        'lessons': [
            ('What is Machine Learning?', 'Understand supervised vs. unsupervised learning, training vs. testing data, overfitting, and the ML development lifecycle. Set up your Python ML environment.'),
            ('Linear Regression & Gradient Descent', 'Implement linear regression from scratch. Understand cost functions, gradient descent, learning rate, and feature scaling. Apply it to a housing price dataset.'),
            ('Classification with Decision Trees & Random Forests', 'Learn decision tree splitting criteria (Gini, entropy), tree pruning, and how random forests reduce overfitting. Classify iris species and spam emails.'),
            ('Introduction to Neural Networks', 'Understand neurons, activation functions, forward/backward propagation, and loss functions. Build a simple neural network with TensorFlow/Keras to recognize handwritten digits.'),
            ('Model Evaluation & Deployment', 'Learn accuracy, precision, recall, F1-score, confusion matrices, and cross-validation. Save and serve your trained model as a REST API.'),
        ],
    },
    {
        'instructor': prof_iyer,
        'title': 'SQL & Database Design',
        'short_description': 'Design schemas, write complex queries, and optimize database performance.',
        'long_description': 'Master relational databases from the ground up. This course covers SQL syntax, joins, subqueries, indexing, normalization, and real-world database design patterns for web applications.',
        'lessons': [
            ('Relational Database Concepts', 'Understand tables, rows, columns, primary keys, and foreign keys. Learn entity-relationship diagrams and how to translate business requirements into database schemas.'),
            ('SQL Fundamentals — SELECT, INSERT, UPDATE, DELETE', 'Write your first SQL queries. Learn filtering with WHERE, sorting with ORDER BY, and limiting results. Practice with a real e-commerce dataset.'),
            ('Joins, Subqueries & Aggregations', 'Master INNER JOIN, LEFT JOIN, CROSS JOIN. Write subqueries and correlated subqueries. Use GROUP BY, HAVING, COUNT, SUM, and AVG for analytics.'),
            ('Indexing & Query Optimization', 'Understand B-tree indexes, composite indexes, and EXPLAIN plans. Identify and fix slow queries. Learn when to index and when not to.'),
        ],
    },

    # ── Prof Khan (DevOps & Cloud) ──
    {
        'instructor': prof_khan,
        'title': 'Docker & Containerization',
        'short_description': 'Package, ship, and run applications anywhere with Docker and Docker Compose.',
        'long_description': 'Learn containerization from first principles. This course covers Docker images, containers, volumes, networking, multi-stage builds, Docker Compose, and deploying to production registries.',
        'lessons': [
            ('Why Containers? Docker Fundamentals', 'Understand the problem containers solve. Install Docker, pull images, run containers, and learn the container lifecycle (create, start, stop, remove).'),
            ('Writing Dockerfiles', 'Build custom images with Dockerfiles. Learn FROM, COPY, RUN, CMD, ENTRYPOINT, multi-stage builds, and how to keep images small and secure.'),
            ('Docker Compose & Multi-Container Apps', 'Define multi-service architectures with docker-compose.yml. Link a web app, database, and cache together. Manage volumes, networks, and environment variables.'),
            ('Registry, CI/CD & Production Deployment', 'Push images to Docker Hub and private registries. Integrate Docker into GitHub Actions pipelines and deploy to cloud platforms.'),
        ],
    },
    {
        'instructor': prof_khan,
        'title': 'Git & Version Control',
        'short_description': 'Master Git workflows — branches, merges, rebases, and team collaboration.',
        'long_description': 'A practical, project-based course on Git. Learn branching strategies, merge conflict resolution, interactive rebasing, cherry-picking, and how professional teams collaborate using GitHub pull requests.',
        'lessons': [
            ('Git Basics — Init, Add, Commit, Log', 'Initialize repositories, stage changes, write meaningful commit messages, and navigate history with git log. Understand the three states: working directory, staging area, and repository.'),
            ('Branching & Merging', 'Create feature branches, switch between branches, and merge completed work. Understand fast-forward vs. three-way merges and resolve merge conflicts confidently.'),
            ('Rebasing, Cherry-Picking & History Rewriting', 'Learn interactive rebase to squash, reorder, and edit commits. Cherry-pick individual commits across branches. Use reflog to recover lost work.'),
            ('GitHub Collaboration — PRs, Reviews & CI', 'Fork repositories, create pull requests, conduct code reviews, and set up branch protection rules. Integrate GitHub Actions for automated testing.'),
        ],
    },

    # ── Additional courses for existing faculty ──
    {
        'instructor': prof_sharma,
        'title': 'REST API Design & Development',
        'short_description': 'Design, build, and document production-grade RESTful APIs.',
        'long_description': 'Learn how to design clean, scalable REST APIs following industry best practices. This course covers resource modeling, HTTP methods, status codes, authentication, pagination, versioning, and OpenAPI documentation.',
        'lessons': [
            ('REST Principles & Resource Design', 'Understand REST constraints, resource naming conventions, HTTP methods (GET, POST, PUT, PATCH, DELETE), and idempotency. Design a real-world API for an e-commerce platform.'),
            ('Authentication & Authorization', 'Implement session-based auth, token-based auth (JWT), and OAuth 2.0. Understand role-based access control (RBAC) and API key management.'),
            ('Pagination, Filtering & Error Handling', 'Implement cursor-based and offset pagination. Add query parameter filtering and sorting. Design consistent error response formats with proper HTTP status codes.'),
        ],
    },
    {
        'instructor': prof_gupta,
        'title': 'Data Visualization with Python',
        'short_description': 'Tell compelling stories with data using Matplotlib, Seaborn, and Plotly.',
        'long_description': 'Transform raw data into beautiful, insightful visualizations. This course covers static plots with Matplotlib, statistical graphics with Seaborn, and interactive dashboards with Plotly.',
        'lessons': [
            ('Matplotlib Essentials', 'Create line charts, bar charts, scatter plots, and histograms. Customize colors, labels, legends, and figure sizes. Save publication-quality figures.'),
            ('Statistical Visualization with Seaborn', 'Build heatmaps, violin plots, pair plots, and regression plots. Learn how to choose the right chart type for different data distributions.'),
            ('Interactive Dashboards with Plotly', 'Create zoomable, hoverable, and clickable charts. Build multi-panel dashboards and deploy them as standalone web applications.'),
        ],
    },
]

created_count = 0
for course_data in courses_to_create:
    if not Course.objects.filter(title=course_data['title']).exists():
        c = Course.objects.create(
            title=course_data['title'],
            short_description=course_data['short_description'],
            long_description=course_data['long_description'],
            instructor=course_data['instructor'],
        )
        for i, (lesson_title, lesson_content) in enumerate(course_data['lessons'], 1):
            Lesson.objects.create(course=c, title=lesson_title, order=i, content=lesson_content)
        created_count += 1
        print(f"Created: {course_data['title']} ({len(course_data['lessons'])} lessons)")
    else:
        print(f"Already exists: {course_data['title']}")

print(f"\n--- Summary ---")
print(f"New courses added: {created_count}")
print(f"Total courses: {Course.objects.count()}")
print(f"Total lessons: {Lesson.objects.count()}")
print(f"Total faculty: {User.objects.filter(groups__name='Faculty').count()}")
print(f"\nNew Faculty Credentials (all use password: Faculty123!):")
print(f"  prof_verma  — Ankit Verma   (UI/UX + CSS)")
print(f"  prof_iyer   — Meera Iyer    (ML + SQL)")
print(f"  prof_khan   — Arif Khan     (Docker + Git)")
