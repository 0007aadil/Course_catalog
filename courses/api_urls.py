from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'faculty/courses', api_views.FacultyCourseViewSet, basename='faculty-course')
# For nested routing (lessons under courses), it's easier to just use standard paths or drf-nested-routers.
# Given simple setup, let's just use standard paths for lessons or we can use another router.
# Wait, FacultyLessonViewSet needs course_pk.


urlpatterns = [
    path('courses/', api_views.CourseListView.as_view(), name='api_course_list'),
    path('courses/<int:pk>/', api_views.CourseDetailView.as_view(), name='api_course_detail'),
    path('courses/<int:pk>/enroll/', api_views.enroll_view, name='api_enroll'),
    path('courses/<int:course_pk>/lessons/<int:lesson_pk>/', api_views.lesson_detail_view, name='api_lesson_detail'),
    path('my-courses/', api_views.MyCoursesView.as_view(), name='api_my_courses'),
    path('faculty/dashboard/', api_views.faculty_dashboard_view, name='api_faculty_dashboard'),
    path('', include(router.urls)),
    path('faculty/courses/<int:course_pk>/lessons/', api_views.FacultyLessonViewSet.as_view({'get': 'list', 'post': 'create'}), name='faculty-lesson-list'),
    path('faculty/courses/<int:course_pk>/lessons/<int:pk>/', api_views.FacultyLessonViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='faculty-lesson-detail'),
]
