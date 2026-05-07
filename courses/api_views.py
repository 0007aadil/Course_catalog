from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Course, Lesson, Enrollment, LessonProgress
from .serializers import (
    CourseListSerializer, CourseDetailSerializer,
    LessonSerializer, EnrollmentSerializer,
    CourseWriteSerializer, LessonWriteSerializer,
)


class CourseListView(generics.ListAPIView):
    """GET /api/courses/ — list all courses."""
    serializer_class = CourseListSerializer

    def get_queryset(self):
        qs = Course.objects.all()
        user = self.request.user
        if user.is_authenticated and not user.is_superuser and user.groups.filter(name='Faculty').exists():
            qs = qs.filter(instructor=user)
        return qs


class CourseDetailView(generics.RetrieveAPIView):
    """GET /api/courses/<id>/ — course detail."""
    serializer_class = CourseDetailSerializer

    def get_queryset(self):
        qs = Course.objects.all()
        user = self.request.user
        if user.is_authenticated and not user.is_superuser and user.groups.filter(name='Faculty').exists():
            qs = qs.filter(instructor=user)
        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll_view(request, pk):
    """POST /api/courses/<id>/enroll/"""
    if request.user.groups.filter(name='Faculty').exists() and not request.user.is_superuser:
        return Response({'detail': 'Faculty cannot enroll in courses.'}, status=status.HTTP_403_FORBIDDEN)

    course = get_object_or_404(Course, pk=pk)
    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user, course=course
    )
    if created:
        return Response({'detail': 'Enrolled successfully.'}, status=status.HTTP_201_CREATED)
    return Response({'detail': 'Already enrolled.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def lesson_detail_view(request, course_pk, lesson_pk):
    """GET /api/courses/<id>/lessons/<id>/"""
    course = get_object_or_404(Course, pk=course_pk)
    lesson = get_object_or_404(Lesson, pk=lesson_pk, course=course)

    if not Enrollment.objects.filter(user=request.user, course=course).exists():
        return Response({'detail': 'Not enrolled.'}, status=status.HTTP_403_FORBIDDEN)

    progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
    if not progress.completed:
        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()

    all_progress = LessonProgress.objects.filter(user=request.user, lesson__course=course)
    lesson_progress = {str(lp.lesson_id): lp.completed for lp in all_progress}

    serializer = LessonSerializer(lesson)
    all_lessons_data = [
        {'id': l.id, 'title': l.title, 'order': l.order}
        for l in course.lessons.all()
    ]

    return Response({
        'lesson': serializer.data,
        'course': {'id': course.id, 'title': course.title},
        'all_lessons': all_lessons_data,
        'lesson_progress': lesson_progress,
    })


class MyCoursesView(generics.ListAPIView):
    """GET /api/my-courses/"""
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            user=self.request.user
        ).select_related('course', 'course__instructor')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def faculty_dashboard_view(request):
    """GET /api/faculty/dashboard/ — faculty's own courses + stats."""
    user = request.user
    courses = Course.objects.filter(instructor=user).prefetch_related('lessons', 'enrollments')
    data = []
    for c in courses:
        data.append({
            'id': c.id,
            'title': c.title,
            'short_description': c.short_description,
            'lesson_count': c.lessons.count(),
            'enrollment_count': c.enrollments.count(),
            'created_at': c.created_at.isoformat() if c.created_at else None,
        })
    total_students = Enrollment.objects.filter(course__instructor=user).values('user').distinct().count()
    return Response({
        'courses': data,
        'total_courses': len(data),
        'total_students': total_students,
        'total_lessons': sum(d['lesson_count'] for d in data),
    })


class FacultyCourseViewSet(viewsets.ModelViewSet):
    """CRUD for Faculty's own courses."""
    serializer_class = CourseWriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class FacultyLessonViewSet(viewsets.ModelViewSet):
    """CRUD for Lessons within a specific course owned by Faculty."""
    serializer_class = LessonWriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_pk = self.kwargs.get('course_pk')
        return Lesson.objects.filter(course__id=course_pk, course__instructor=self.request.user)

    def perform_create(self, serializer):
        course = get_object_or_404(Course, id=self.kwargs.get('course_pk'), instructor=self.request.user)
        serializer.save(course=course)
