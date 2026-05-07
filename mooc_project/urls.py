from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # REST API
    path('api/', include('courses.api_urls')),
    path('api/auth/', include('accounts.api_urls')),
]
