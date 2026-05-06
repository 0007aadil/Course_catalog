from django.contrib import admin
from django.urls import path, include
from accounts import views as accounts_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Legacy template views (still work)
    path('accounts/', include('accounts.urls')),
    path('courses/', include('courses.urls')),
    path('', accounts_views.landing_page, name='landing'),

    # REST API
    path('api/', include('courses.api_urls')),
    path('api/auth/', include('accounts.api_urls')),
]
