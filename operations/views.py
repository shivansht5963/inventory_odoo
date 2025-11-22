import requests
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions, views
from rest_framework.response import Response

from .models import Order, OrderItem, InventoryAllocation, OP_DELIVERY, ORDER_PLACED, ORDER_RESERVED, ORDER_PICKED
from .serializers import (
    OrderCreateSerializer,
    OrderDetailSerializer,
    AllocationSerializer,
    OrderStatusSerializer,
)
from inventory.models import Stock


# Order create view 
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Use the input serializer to validate & save, then return a proper
        OrderDetailSerializer representation of the created order.
        This avoids DRF trying to use the input serializer to represent model instances.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        out = OrderDetailSerializer(order, context={"request": request})
        headers = {"Location": f"/api/v1/operations/orders/{order.id}/"}
        return Response(out.data, status=status.HTTP_201_CREATED, headers=headers)


# Helper: call external reserve endpoint if configured
def call_reserve_api(sku, qty, warehouse_id):
    """
    Calls external inventory reserve endpoint if INVENTORY_SERVICE_URL is configured.
    Otherwise returns a stub success (for local dev).
    """
    base = getattr(settings, "INVENTORY_SERVICE_URL", None)
    if not base:
        # No external service configured -> treat as success (stub)
        return {"success": True, "reserved_qty": qty}
    url = f"{base.rstrip('/')}/api/v1/inventory/reserve/"
    try:
        resp = requests.post(url, json={"sku": sku, "qty": qty, "warehouse_id": str(warehouse_id)}, timeout=5)
        # Expect JSON: { "success": true/false, "reserved_qty": n, "reason": "..." }
        return resp.json()
    except Exception as exc:
        return {"success": False, "reason": f"reserve-call-failed: {exc}"}

# Fulfill (reserve) view

class OrderFulfillView(views.APIView):
    """
    POST /api/v1/operations/orders/{id}/fulfill/
    Tries to reserve each item. On success creates InventoryAllocation and sets order.status = 'RESERVED'.
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        order = get_object_or_404(Order.objects.select_for_update().prefetch_related("items"), pk=pk)
        if order.status != ORDER_PLACED:
            return Response({"detail": "Order not in PLACED state"}, status=status.HTTP_409_CONFLICT)

        reserved_items = []
        for item in order.items.all():
            sku = item.product.sku
            qty = item.qty
            # call Amrita's reserve endpoint (or stub)
            result = call_reserve_api(sku, qty, order.warehouse_id)
            if not result.get("success"):
                transaction.set_rollback(True)
                return Response({"detail": f"Reserve failed for {sku}", "reason": result.get("reason")}, status=status.HTTP_400_BAD_REQUEST)
            reserved_qty = result.get("reserved_qty", qty)
            # create allocation record
            alloc = InventoryAllocation.objects.create(
                order=order,
                product=item.product,
                warehouse=order.warehouse,
                qty=reserved_qty,
                created_by=request.user
            )
            reserved_items.append(alloc)

        order.status = ORDER_RESERVED
        order.save(update_fields=["status", "updated_at"])
        return Response({
            "order_id": str(order.id),
            "status": order.status,
            "reserved": AllocationSerializer(reserved_items, many=True).data
        }, status=status.HTTP_201_CREATED)



# Pick view

class OrderPickView(views.APIView):
    """
    POST /api/v1/operations/orders/{id}/pick/
    Move RESERVED -> PICKED
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        if order.status != ORDER_RESERVED:
            return Response({"detail": "Order not in RESERVED state"}, status=status.HTTP_409_CONFLICT)
        order.status = ORDER_PICKED
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderStatusSerializer(order).data, status=status.HTTP_200_OK)

# Ship view

class OrderShipView(views.APIView):
    """
    POST /api/v1/operations/orders/{id}/ship/
    Move PICKED -> SHIPPED, decrement Stock (transactional) and write ledger entries.
    """
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        order = get_object_or_404(Order.objects.select_for_update().prefetch_related("items", "allocations"), pk=pk)
        if order.status != ORDER_PICKED:
            return Response({"detail": "Order not in PICKED state"}, status=status.HTTP_409_CONFLICT)

       
        for alloc in order.allocations.select_related("product", "warehouse").all():
            # lock relevant stock row
            stock_qs = Stock.objects.select_for_update().filter(product=alloc.product, warehouse=alloc.warehouse)
            stock = stock_qs.first()
            if not stock or stock.qty < alloc.qty:
                transaction.set_rollback(True)
                return Response({"detail": f"Insufficient stock for {alloc.product.sku}"}, status=status.HTTP_400_BAD_REQUEST)
            stock.qty -= alloc.qty
            stock.save(update_fields=["qty", "updated_at"])


            from .models import Ledger  
            Ledger.objects.create(
                product=alloc.product,
                warehouse=alloc.warehouse,
                qty_change=-int(alloc.qty),
                operation_type=OP_DELIVERY,
                reference_id=order.id,
                created_by=request.user
            )

        order.status = "SHIPPED"
        order.save(update_fields=["status", "updated_at"])
        return Response(OrderStatusSerializer(order).data, status=status.HTTP_200_OK)
