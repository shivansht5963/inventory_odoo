from rest_framework import serializers
from .models import Stock, StockTransaction

class StockSerializer(serializers.ModelSerializer):
    sku_code = serializers.CharField(source="sku.code", read_only=True)

    class Meta:
        model = Stock
        fields = ["id", "sku", "sku_code", "total_qty", "reserved_qty", "updated_at"]


class StockTransactionSerializer(serializers.ModelSerializer):
    sku_code = serializers.CharField(source="sku.code", read_only=True)

    class Meta:
        model = StockTransaction
        fields = ["id", "sku", "sku_code", "delta", "reason", "created_at"]
