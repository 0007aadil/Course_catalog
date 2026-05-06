from django.urls import path
from . import api_views

urlpatterns = [
    path('csrf/', api_views.csrf_view, name='api_csrf'),
    path('login/', api_views.login_view, name='api_login'),
    path('signup/', api_views.signup_view, name='api_signup'),
    path('logout/', api_views.logout_view, name='api_logout'),
    path('me/', api_views.me_view, name='api_me'),
]
