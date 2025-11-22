from rest_framework import serializers
from .models import Order, OrderItem, InventoryAllocation
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
        request = self.context.get("request")
        user = getattr(request, "user", None)
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



class OrderItemSerializer(serializers.ModelSerializer):
    sku = serializers.CharField(source="product.sku", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "sku", "product_name", "qty"]


class OrderDetailSerializer(serializers.ModelSerializer):
    
    items = OrderItemSerializer(many=True, read_only=True)
    warehouse = serializers.CharField(source="warehouse.name", read_only=True)
    created_by = serializers.CharField(source="created_by.email", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "customer_name", "status", "warehouse", "created_by", "created_at", "items"]



class AllocationSerializer(serializers.ModelSerializer):
    product_sku = serializers.CharField(source="product.sku", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = InventoryAllocation
        fields = ["id", "order", "product", "product_sku", "product_name", "warehouse", "qty", "created_at"]

##orderstatusserializer
class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "customer_name", "status", "created_at"] 
