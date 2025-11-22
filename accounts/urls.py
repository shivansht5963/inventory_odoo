from django.urls import path
from .views import AuthViewSet, UserViewSet

urlpatterns = [
    # Auth endpoints
    path('register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('refresh/', AuthViewSet.as_view({'post': 'refresh'}), name='refresh'),
    
    # User profile endpoints - GET and PUT on same endpoint
    path('users/me/', UserViewSet.as_view({'get': 'me', 'put': 'update_profile'}), name='user-profile'),
]
