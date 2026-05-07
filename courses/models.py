from django.db import models
from django.conf import settings


class Course(models.Model):
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300, blank=True, default='')
    long_description = models.TextField(blank=True, default='')
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='courses_created',
        help_text='Faculty member who created this course'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='lessons'
    )
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, default='')
    video_url = models.URLField(blank=True, null=True, help_text="Optional YouTube embed URL or direct video link")
    document_url = models.URLField(blank=True, null=True, help_text="Optional link to a PDF or resource document")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.course.title} — {self.title}"


class Enrollment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='enrollments'
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} → {self.course.title}"


class LessonProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name='progress'
    )
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name_plural = 'Lesson progress'

    def __str__(self):
        status = '✓' if self.completed else '○'
        return f"{status} {self.user.username} — {self.lesson.title}"
