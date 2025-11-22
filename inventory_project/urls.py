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

urlpatterns = [
    path('admin/', admin.site.urls),
<<<<<<< HEAD
    # Auth endpoints
    path('api/v1/auth/register/', AuthViewSet.as_view({'post': 'register'}), name='register'),
    path('api/v1/auth/login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('api/v1/auth/refresh/', AuthViewSet.as_view({'post': 'refresh'}), name='refresh'),
    # User profile endpoints
    path('api/v1/users/me/', UserViewSet.as_view({'get': 'me', 'put': 'update_profile'}), name='user-profile'),
    path("api/v1/operations/", include("operations.urls")),
    path("catelog/", include("catelog.urls")),
    path('api/inventory/', include('inventory.urls')),   
=======
    path("catelog/", include("catelog.urls")),
    path('api/inventory/', include('inventory.urls')),   

>>>>>>> bb6826cdaeaa6ec15433302f95af2a8c3d30925d
]
