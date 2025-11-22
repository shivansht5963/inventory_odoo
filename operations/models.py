import uuid

from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


STATUS_DRAFT = "Draft"
STATUS_DONE = "Done"
STATUS_CHOICES = ((STATUS_DRAFT, "Draft"), (STATUS_DONE, "Done"))

OP_RECEIPT = "RECEIPT"
OP_DELIVERY = "DELIVERY"
OP_TRANSFER = "TRANSFER"
OP_ADJUSTMENT = "ADJUSTMENT"
OPERATION_CHOICES = ((OP_RECEIPT, OP_RECEIPT), (OP_DELIVERY, OP_DELIVERY), (OP_TRANSFER, OP_TRANSFER), (OP_ADJUSTMENT, OP_ADJUSTMENT))

ORDER_PLACED = "PLACED"
ORDER_RESERVED = "RESERVED"
ORDER_PICKED = "PICKED"
ORDER_SHIPPED = "SHIPPED"
ORDER_STATUS_CHOICES = (
    (ORDER_PLACED, "Placed"),
    (ORDER_RESERVED, "Reserved"),
    (ORDER_PICKED, "Picked"),
    (ORDER_SHIPPED, "Shipped"),
)
# ghjkl
class Receipt(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	supplier = models.CharField(max_length=255)
	warehouse = models.ForeignKey(
		"warehouse.Warehouse",
		on_delete=models.PROTECT,
		related_name="receipts",
	)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.PROTECT,
		related_name="receipts_created",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"Receipt {self.id} - {self.supplier} - {self.status}"

	class Meta:
		indexes = [models.Index(fields=["created_at"]), models.Index(fields=["warehouse"])]


class ReceiptItem(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	receipt = models.ForeignKey(
		Receipt, on_delete=models.CASCADE, related_name="items"
	)
	product = models.ForeignKey(
		"catelog.Product", on_delete=models.PROTECT, related_name="receipt_items"
	)
	qty = models.PositiveIntegerField(validators=[MinValueValidator(1)])

	def __str__(self):
		return f"{self.product} x {self.qty} (Receipt: {self.receipt_id if hasattr(self,'receipt_id') else self.receipt.id})"

	class Meta:
		indexes = [models.Index(fields=["product"])]


class Delivery(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	customer = models.CharField(max_length=255)
	warehouse = models.ForeignKey(
		"warehouse.Warehouse",
		on_delete=models.PROTECT,
		related_name="deliveries",
	)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.PROTECT,
		related_name="deliveries_created",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"Delivery {self.id} - {self.customer} - {self.status}"

	class Meta:
		indexes = [models.Index(fields=["created_at"]), models.Index(fields=["warehouse"])]


class DeliveryItem(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	delivery = models.ForeignKey(
		Delivery, on_delete=models.CASCADE, related_name="items"
	)
	product = models.ForeignKey(
		"catelog.Product", on_delete=models.PROTECT, related_name="delivery_items"
	)
	qty = models.PositiveIntegerField(validators=[MinValueValidator(1)])

	def __str__(self):
		return f"{self.product} x {self.qty} (Delivery: {self.delivery.id})"

	class Meta:
		indexes = [models.Index(fields=["product"])]


class Transfer(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	from_warehouse = models.ForeignKey(
		"warehouse.Warehouse", on_delete=models.PROTECT, related_name="transfers_out"
	)
	to_warehouse = models.ForeignKey(
		"warehouse.Warehouse", on_delete=models.PROTECT, related_name="transfers_in"
	)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.PROTECT,
		related_name="transfers_created",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def clean(self):
		if self.from_warehouse_id == self.to_warehouse_id:
			raise ValidationError({"to_warehouse": "Destination warehouse must differ from source"})

	def __str__(self):
		return f"Transfer {self.id} - {self.from_warehouse} -> {self.to_warehouse} ({self.status})"

	class Meta:
		indexes = [models.Index(fields=["created_at"]), models.Index(fields=["from_warehouse", "to_warehouse"])]


class TransferItem(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	transfer = models.ForeignKey(Transfer, on_delete=models.CASCADE, related_name="items")
	product = models.ForeignKey(
		"catelog.Product", on_delete=models.PROTECT, related_name="transfer_items"
	)
	qty = models.PositiveIntegerField(validators=[MinValueValidator(1)])

	def __str__(self):
		return f"{self.product} x {self.qty} (Transfer: {self.transfer.id})"

	class Meta:
		indexes = [models.Index(fields=["product"])]
class Order(models.Model):
    """Customer Order for fulfillment pipeline."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=255)
    warehouse = models.ForeignKey(
        "warehouse.Warehouse",
        on_delete=models.PROTECT,
        related_name="orders",
    )
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default=ORDER_PLACED)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer_name} - {self.status}"

    class Meta:
        indexes = [models.Index(fields=["created_at"]), models.Index(fields=["status", "warehouse"])]

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        "catelog.Product", on_delete=models.PROTECT, related_name="order_items"
    )
    qty = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return f"{self.product.sku} x {self.qty} (Order: {self.order.id})"

    class Meta:
        indexes = [models.Index(fields=["product"]), models.Index(fields=["order"])]

  


class Ledger(models.Model):
	"""Ledger of stock movements. qty_change may be + or - depending on operation."""

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	product = models.ForeignKey(
		"catelog.Product", on_delete=models.PROTECT, related_name="ledger_entries"
	)
	warehouse = models.ForeignKey(
		"warehouse.Warehouse", on_delete=models.PROTECT, related_name="ledger_entries"
	)
	qty_change = models.IntegerField()
	operation_type = models.CharField(max_length=16, choices=OPERATION_CHOICES)
	reference_id = models.UUIDField(null=True, blank=True)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="ledger_created"
	)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Ledger {self.id} - {self.product} @ {self.warehouse}: {self.qty_change} ({self.operation_type})"

	class Meta:
		indexes = [models.Index(fields=["product", "warehouse"]), models.Index(fields=["created_at"])]
