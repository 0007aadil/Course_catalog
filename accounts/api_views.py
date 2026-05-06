from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator

from courses.serializers import UserSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_view(request):
    """GET /api/auth/csrf/ — set CSRF cookie for the frontend."""
    return Response({'detail': 'CSRF cookie set.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """POST /api/auth/login/ — authenticate user."""
    username = request.data.get('username', '')
    password = request.data.get('password', '')

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {'detail': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """POST /api/auth/signup/ — register new user."""
    username = request.data.get('username', '')
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    password2 = request.data.get('password2', '')

    if not username or not password:
        return Response(
            {'detail': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if password != password2:
        return Response(
            {'detail': 'Passwords do not match.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'detail': 'Username already taken.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """POST /api/auth/logout/ — log out user."""
    logout(request)
    return Response({'detail': 'Logged out.'})


@api_view(['GET'])
@permission_classes([AllowAny])
def me_view(request):
    """GET /api/auth/me/ — current user info + role."""
    if not request.user.is_authenticated:
        return Response({'detail': 'Not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
