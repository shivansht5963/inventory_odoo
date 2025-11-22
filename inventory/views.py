from rest_framework import viewsets
from .models import Stock, StockTransaction
from .serializers import StockSerializer, StockTransactionSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all().select_related("sku")
    serializer_class = StockSerializer


class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.all().select_related("sku")
    serializer_class = StockTransactionSerializer
