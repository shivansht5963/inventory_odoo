from rest_framework import generics
from .serializers import OrderCreateSerializer
from .models import Order


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context
