from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthTests(TestCase):
    """Test JWT authentication endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'staff'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['email'], 'testuser@example.com')
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())
    
    def test_jwt_token_issue(self):
        """Test JWT token generation on login"""
        # Create user
        User.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Login
        data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])
        self.assertIsNotNone(response.data['data']['access'])
        self.assertIsNotNone(response.data['data']['refresh'])
