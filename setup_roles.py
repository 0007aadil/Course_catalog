"""
Seed script to set up Faculty group, sample faculty, and sample courses.
Run with: python3 manage.py shell < setup_roles.py
"""
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType
from courses.models import Course, Lesson

# ============================================================
# 1. Create "Faculty" group with limited permissions
# ============================================================
faculty_group, created = Group.objects.get_or_create(name='Faculty')

# Get content types for Course and Lesson
course_ct = ContentType.objects.get_for_model(Course)
lesson_ct = ContentType.objects.get_for_model(Lesson)

# Assign permissions: add/change/delete/view Course + Lesson only
permissions = Permission.objects.filter(
    content_type__in=[course_ct, lesson_ct]
)
faculty_group.permissions.set(permissions)

status = "Created" if created else "Already exists"
print(f"✅ Faculty group: {status}")
print(f"   Permissions: {list(permissions.values_list('codename', flat=True))}")

# ============================================================
# 2. Create sample faculty accounts
# ============================================================
faculty_data = [
    {
        'username': 'prof_sharma',
        'email': 'sharma@university.com',
        'password': 'Faculty123!',
        'first_name': 'Rajesh',
        'last_name': 'Sharma',
    },
    {
        'username': 'prof_gupta',
        'email': 'gupta@university.com',
        'password': 'Faculty123!',
        'first_name': 'Priya',
        'last_name': 'Gupta',
    },
]

for data in faculty_data:
    user, created = User.objects.get_or_create(
        username=data['username'],
        defaults={
            'email': data['email'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'is_staff': True,      # Can access /admin/
            'is_superuser': False,  # Restricted access
        }
    )
    if created:
        user.set_password(data['password'])
        user.save()
        user.groups.add(faculty_group)
        print(f"✅ Created faculty: {data['username']} (password: {data['password']})")
    else:
        print(f"⏭️  Faculty already exists: {data['username']}")

# ============================================================
# 3. Create sample courses by each faculty
# ============================================================
prof_sharma = User.objects.get(username='prof_sharma')
prof_gupta = User.objects.get(username='prof_gupta')

# Prof Sharma's courses
if not Course.objects.filter(instructor=prof_sharma).exists():
    c1 = Course.objects.create(
        title="Python Programming Fundamentals",
        short_description="Learn Python from scratch — variables, loops, functions, and more.",
        long_description="This comprehensive course covers the fundamentals of Python programming. "
                         "You will learn about data types, control flow, functions, file handling, "
                         "and object-oriented programming.",
        instructor=prof_sharma,
    )
    Lesson.objects.create(course=c1, title="Introduction to Python", order=1,
        content="Python is a high-level, interpreted programming language. In this lesson we cover installation, the REPL, and your first 'Hello World' program.")
    Lesson.objects.create(course=c1, title="Variables and Data Types", order=2,
        content="Learn about integers, floats, strings, booleans, and how to store values in variables.")
    Lesson.objects.create(course=c1, title="Control Flow — if/else and Loops", order=3,
        content="Understand conditional statements (if, elif, else) and loops (for, while).")

    c2 = Course.objects.create(
        title="Web Development with Django",
        short_description="Build full-stack web applications using the Django framework.",
        long_description="Dive into web development with Django, the Python web framework for "
                         "perfectionists with deadlines.",
        instructor=prof_sharma,
    )
    Lesson.objects.create(course=c2, title="Django Project Setup", order=1,
        content="Install Django, create a project and app, understand the project structure.")
    Lesson.objects.create(course=c2, title="Models and Databases", order=2,
        content="Define models, run migrations, and interact with your database using Django's ORM.")

    print(f"✅ Created 2 courses for Prof. Sharma")

# Prof Gupta's courses
if not Course.objects.filter(instructor=prof_gupta).exists():
    c3 = Course.objects.create(
        title="Data Science Essentials",
        short_description="Introduction to data analysis with Python, Pandas, and Matplotlib.",
        long_description="Get started with data science using Python. This course covers data "
                         "manipulation with Pandas and data visualization with Matplotlib.",
        instructor=prof_gupta,
    )
    Lesson.objects.create(course=c3, title="Introduction to Data Science", order=1,
        content="What is data science? Overview of the data science workflow.")
    Lesson.objects.create(course=c3, title="NumPy Fundamentals", order=2,
        content="Learn NumPy arrays, broadcasting, indexing, and essential operations.")
    Lesson.objects.create(course=c3, title="Data Manipulation with Pandas", order=3,
        content="Work with DataFrames and Series. Load CSV files, filter data, group and aggregate.")

    print(f"✅ Created 1 course for Prof. Gupta")

print(f"\n📊 Summary:")
print(f"   Total courses: {Course.objects.count()}")
print(f"   Total lessons: {Lesson.objects.count()}")
print(f"   Total faculty: {User.objects.filter(groups__name='Faculty').count()}")
print(f"\n🔑 Login credentials:")
print(f"   Super Admin: admin / admin123")
print(f"   Prof. Sharma: prof_sharma / Faculty123!")
print(f"   Prof. Gupta: prof_gupta / Faculty123!")
