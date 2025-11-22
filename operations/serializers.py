from rest_framework import serializers
from .models import Order, OrderItem
from catelog.models import Product
from warehouse.models import Warehouse


class OrderItemInputSerializer(serializers.Serializer):
    sku = serializers.CharField()
    qty = serializers.IntegerField(min_value=1)

    def validate(self, data):
        try:
            product = Product.objects.get(sku=data["sku"])
            data["product"] = product
        except Product.DoesNotExist:
            raise serializers.ValidationError(f"Invalid SKU: {data['sku']}")
        return data


class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField()
    warehouse_id = serializers.UUIDField()
    items = OrderItemInputSerializer(many=True)

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        warehouse = Warehouse.objects.get(id=validated_data["warehouse_id"])

        # Create order
        order = Order.objects.create(
            customer_name=validated_data["customer_name"],
            warehouse=warehouse,
            created_by=user
        )

        # Create order items
        for item in validated_data["items"]:
            OrderItem.objects.create(
                order=order,
                product=item["product"],
                qty=item["qty"]
            )

        return order
