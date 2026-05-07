from django.urls import path
from . import api_views

urlpatterns = [
    path('courses/', api_views.CourseListView.as_view(), name='api_course_list'),
    path('courses/<int:pk>/', api_views.CourseDetailView.as_view(), name='api_course_detail'),
    path('courses/<int:pk>/enroll/', api_views.enroll_view, name='api_enroll'),
    path('courses/<int:course_pk>/lessons/<int:lesson_pk>/', api_views.lesson_detail_view, name='api_lesson_detail'),
    path('my-courses/', api_views.MyCoursesView.as_view(), name='api_my_courses'),
    path('faculty/dashboard/', api_views.faculty_dashboard_view, name='api_faculty_dashboard'),
]
