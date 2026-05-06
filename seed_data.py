"""
Seed script to populate the database with sample courses and lessons.
Run with: python3 manage.py shell < seed_data.py
"""
from courses.models import Course, Lesson

# Course 1: Python Programming
c1 = Course.objects.create(
    title="Python Programming Fundamentals",
    short_description="Learn Python from scratch — variables, loops, functions, and more.",
    long_description=(
        "This comprehensive course covers the fundamentals of Python programming. "
        "You will learn about data types, control flow, functions, file handling, "
        "and object-oriented programming. By the end, you'll be able to write "
        "clean, efficient Python code for real-world applications."
    ),
)
Lesson.objects.create(course=c1, title="Introduction to Python", order=1,
    content="Python is a high-level, interpreted programming language. In this lesson we cover installation, the REPL, and your first 'Hello World' program.")
Lesson.objects.create(course=c1, title="Variables and Data Types", order=2,
    content="Learn about integers, floats, strings, booleans, and how to store values in variables. We also cover type conversion and basic operators.")
Lesson.objects.create(course=c1, title="Control Flow — if/else and Loops", order=3,
    content="Understand conditional statements (if, elif, else) and loops (for, while). Practice with exercises like FizzBuzz and number guessing games.")
Lesson.objects.create(course=c1, title="Functions and Modules", order=4,
    content="Define reusable functions with parameters and return values. Learn about scope, lambda functions, and importing modules.")
Lesson.objects.create(course=c1, title="File Handling and Error Management", order=5,
    content="Read and write files, handle exceptions with try/except, and work with context managers for safe resource handling.")

# Course 2: Web Development with Django
c2 = Course.objects.create(
    title="Web Development with Django",
    short_description="Build full-stack web applications using the Django framework.",
    long_description=(
        "Dive into web development with Django, the Python web framework for "
        "perfectionists with deadlines. Learn about models, views, templates, "
        "forms, authentication, and deployment. Build a complete web app from scratch."
    ),
)
Lesson.objects.create(course=c2, title="Django Project Setup", order=1,
    content="Install Django, create a project and app, understand the project structure, and run your first development server.")
Lesson.objects.create(course=c2, title="Models and Databases", order=2,
    content="Define models, run migrations, and interact with your database using Django's ORM. Cover relationships, querysets, and the admin panel.")
Lesson.objects.create(course=c2, title="Views and URL Routing", order=3,
    content="Create function-based and class-based views. Map URLs to views and pass data to templates.")
Lesson.objects.create(course=c2, title="Templates and Static Files", order=4,
    content="Build HTML templates with Django's template language. Use template inheritance, filters, and serve static CSS/JS files.")

# Course 3: Data Science Essentials
c3 = Course.objects.create(
    title="Data Science Essentials",
    short_description="Introduction to data analysis with Python, Pandas, and Matplotlib.",
    long_description=(
        "Get started with data science using Python. This course covers data "
        "manipulation with Pandas, data visualization with Matplotlib, and "
        "basic statistical analysis. Perfect for beginners wanting to explore "
        "the world of data."
    ),
)
Lesson.objects.create(course=c3, title="Introduction to Data Science", order=1,
    content="What is data science? Overview of the data science workflow: data collection, cleaning, analysis, visualization, and communication.")
Lesson.objects.create(course=c3, title="NumPy Fundamentals", order=2,
    content="Learn NumPy arrays, broadcasting, indexing, and essential mathematical operations for numerical computing.")
Lesson.objects.create(course=c3, title="Data Manipulation with Pandas", order=3,
    content="Work with DataFrames and Series. Load CSV files, filter data, group and aggregate, and handle missing values.")

print("✅ Seeded 3 courses with lessons successfully!")
