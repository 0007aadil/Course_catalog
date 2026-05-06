from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.urls import reverse
from .forms import SignUpForm


def get_redirect_url_for_user(user):
    """Return the appropriate dashboard URL based on user role."""
    if user.is_superuser or user.groups.filter(name='Faculty').exists():
        return '/admin/'
    return reverse('course_list')


class RoleBasedLoginView(LoginView):
    """Custom login view that redirects users based on their role after login."""
    template_name = 'accounts/login.html'

    def get_success_url(self):
        return get_redirect_url_for_user(self.request.user)


def landing_page(request):
    """Landing page — redirect authenticated users to their dashboard."""
    if request.user.is_authenticated:
        return redirect(get_redirect_url_for_user(request.user))
    return render(request, 'accounts/landing.html')


def signup(request):
    """Handle user registration."""
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect(get_redirect_url_for_user(user))
    else:
        form = SignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})
