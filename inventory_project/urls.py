"""
URL configuration for inventory_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from accounts.views import AuthViewSet, UserViewSet
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

# Health check and API documentation endpoint
@require_http_methods(["GET"])
def api_home(request):
    return JsonResponse({
        'status': 'API is running!',
        'message': 'Inventory Backend API - Hackathon Edition',
        'available_endpoints': {
            'admin': '/admin/',
            'auth': {
                'register': 'POST /api/v1/auth/register/',
                'login': 'POST /api/v1/auth/login/',
                'refresh': 'POST /api/v1/auth/refresh/',
            },
            'users': {
                'profile': 'GET /api/v1/users/me/',
                'update': 'PUT /api/v1/users/me/',
            },
            'operations': 'GET /api/v1/operations/',
            'catalog': 'GET /api/v1/catelog/',
            'inventory': 'GET /api/v1/inventory/',
        },
        'version': '1.0.0'
    })

urlpatterns = [
    path('', api_home, name='api-home'),  # Root endpoint with documentation
    path('admin/', admin.site.urls),
    # Auth endpoints
    path('api/v1/auth/register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('api/v1/auth/login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('api/v1/auth/refresh/', AuthViewSet.as_view({'post': 'refresh'}), name='refresh'),
    # User profile endpoints
    path('api/v1/users/me/', UserViewSet.as_view({'get': 'me', 'put': 'update_profile'}), name='user-profile'),
    path("api/v1/operations/", include("operations.urls")),
    path("api/v1/catelog/", include("catelog.urls")),
    path('api/v1/inventory/', include('inventory.urls')),
]
