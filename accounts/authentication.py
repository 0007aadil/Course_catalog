from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuth(SessionAuthentication):
    """
    SessionAuthentication subclass that skips CSRF enforcement.
    
    Used for API endpoints consumed by the React SPA on a different origin.
    The SPA handles its own CSRF flow via the /api/auth/csrf/ endpoint,
    but cross-origin cookie restrictions make Django's built-in CSRF
    check fail in development (HTTP, different ports).
    """

    def enforce_csrf(self, request):
        # Skip CSRF check for API requests
        return
