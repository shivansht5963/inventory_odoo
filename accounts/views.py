from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, TokenSerializer


class AuthViewSet(viewsets.ViewSet):
    """Handle user authentication (register, login, refresh)"""
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """User registration endpoint"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'success': True,
                    'data': UserSerializer(user).data,
                    'message': 'User registered successfully'
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'success': False,
                'errors': serializer.errors,
                'message': 'Registration failed'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login - returns JWT tokens"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'success': True,
                    'data': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': UserSerializer(user).data
                    },
                    'message': 'Login successful'
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'success': False,
                'errors': serializer.errors,
                'message': 'Login failed'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    @action(detail=False, methods=['post'])
    def refresh(self, request):
        """Refresh JWT access token"""
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {
                    'success': False,
                    'errors': {'refresh': 'Refresh token required'},
                    'message': 'Refresh failed'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            return Response(
                {
                    'success': True,
                    'data': {'access': str(refresh.access_token)},
                    'message': 'Token refreshed'
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'errors': {'refresh': str(e)},
                    'message': 'Invalid refresh token'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


class UserViewSet(viewsets.ViewSet):
    """Handle user profile operations"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = UserSerializer(request.user)
        return Response(
            {
                'success': True,
                'data': serializer.data,
                'message': 'Profile retrieved'
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update current user profile (email, name, role)"""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'success': True,
                    'data': serializer.data,
                    'message': 'Profile updated'
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'success': False,
                'errors': serializer.errors,
                'message': 'Update failed'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
