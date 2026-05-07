from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Lesson, Enrollment, LessonProgress


class InstructorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'full_name')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'order', 'content')


class LessonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'order')


class CourseListSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer(read_only=True)
    lesson_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'title', 'short_description', 'instructor', 'lesson_count', 'created_at')

    def get_lesson_count(self, obj):
        return obj.lessons.count()


class CourseDetailSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer(read_only=True)
    lessons = LessonListSerializer(many=True, read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    lesson_progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'title', 'short_description', 'long_description',
                  'instructor', 'lessons', 'is_enrolled', 'lesson_progress', 'created_at')

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            return False
        return Enrollment.objects.filter(user=request.user, course=obj).exists()

    def get_lesson_progress(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user') or not request.user.is_authenticated:
            return {}
        progress_qs = LessonProgress.objects.filter(user=request.user, lesson__course=obj)
        return {str(lp.lesson_id): lp.completed for lp in progress_qs}


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'course', 'enrolled_at')


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        if obj.groups.filter(name='Faculty').exists():
            return 'faculty'
        return 'student'

class CourseWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'short_description', 'long_description')

class LessonWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'title', 'content', 'order')
