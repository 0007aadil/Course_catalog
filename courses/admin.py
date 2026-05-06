from django.contrib import admin
from .models import Course, Lesson, Enrollment, LessonProgress


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('title', 'order', 'content')

    def get_queryset(self, request):
        """Faculty sees only lessons for their own courses."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(course__instructor=request.user)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'short_description', 'created_at')
    search_fields = ('title',)
    inlines = [LessonInline]

    def get_queryset(self, request):
        """Faculty sees only their own courses. Super Admin sees all."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(instructor=request.user)

    def save_model(self, request, obj, form, change):
        """Auto-assign instructor to the logged-in faculty user."""
        if not change:  # Only on creation (not editing)
            obj.instructor = request.user
        super().save_model(request, obj, form, change)

    def get_fields(self, request, obj=None):
        """Hide instructor field for faculty (auto-set). Show for Super Admin."""
        if request.user.is_superuser:
            return ('title', 'short_description', 'long_description', 'instructor')
        return ('title', 'short_description', 'long_description')

    def get_readonly_fields(self, request, obj=None):
        """Make instructor read-only for Super Admin when editing."""
        if request.user.is_superuser and obj:
            return ('instructor',)
        return ()


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    list_filter = ('course',)
    search_fields = ('title',)

    def get_queryset(self, request):
        """Faculty sees only lessons for their own courses."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(course__instructor=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Faculty can only link lessons to their own courses."""
        if db_field.name == 'course' and not request.user.is_superuser:
            kwargs['queryset'] = Course.objects.filter(instructor=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at')
    list_filter = ('course',)

    def has_module_permission(self, request):
        """Only Super Admin can see enrollments."""
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'completed', 'completed_at')
    list_filter = ('completed',)

    def has_module_permission(self, request):
        """Only Super Admin can see lesson progress."""
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser
