from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone

from .models import Course, Lesson, Enrollment, LessonProgress


def course_list(request):
    """Display all available courses."""
    courses = Course.objects.all()
    return render(request, 'courses/course_list.html', {'courses': courses})


def course_detail(request, course_id):
    """Show course details, lessons, and enrollment status."""
    course = get_object_or_404(Course, pk=course_id)
    lessons = course.lessons.all()

    is_enrolled = False
    lesson_progress = {}

    if request.user.is_authenticated:
        is_enrolled = Enrollment.objects.filter(
            user=request.user, course=course
        ).exists()

        if is_enrolled:
            progress_qs = LessonProgress.objects.filter(
                user=request.user, lesson__course=course
            )
            lesson_progress = {
                lp.lesson_id: lp.completed for lp in progress_qs
            }

    return render(request, 'courses/course_detail.html', {
        'course': course,
        'lessons': lessons,
        'is_enrolled': is_enrolled,
        'lesson_progress': lesson_progress,
    })


@login_required
def enroll(request, course_id):
    """Enroll the current user in a course."""
    course = get_object_or_404(Course, pk=course_id)
    Enrollment.objects.get_or_create(user=request.user, course=course)
    return redirect('course_detail', course_id=course.pk)


@login_required
def lesson_detail(request, course_id, lesson_id):
    """View a lesson and mark it as completed."""
    course = get_object_or_404(Course, pk=course_id)
    lesson = get_object_or_404(Lesson, pk=lesson_id, course=course)

    # Ensure user is enrolled
    enrollment = get_object_or_404(
        Enrollment, user=request.user, course=course
    )

    # Mark lesson as visited/completed
    progress, created = LessonProgress.objects.get_or_create(
        user=request.user, lesson=lesson
    )
    if not progress.completed:
        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()

    # Get all lesson progress for the sidebar
    all_lessons = course.lessons.all()
    progress_qs = LessonProgress.objects.filter(
        user=request.user, lesson__course=course
    )
    lesson_progress = {lp.lesson_id: lp.completed for lp in progress_qs}

    return render(request, 'courses/lesson_detail.html', {
        'course': course,
        'lesson': lesson,
        'all_lessons': all_lessons,
        'lesson_progress': lesson_progress,
    })


@login_required
def my_courses(request):
    """Display courses the current user is enrolled in."""
    enrollments = Enrollment.objects.filter(
        user=request.user
    ).select_related('course')
    return render(request, 'courses/my_courses.html', {
        'enrollments': enrollments,
    })
