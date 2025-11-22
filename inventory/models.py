import uuid

from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


class Stock(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.OneToOneField(
        "catelog.SKU", on_delete=models.CASCADE, related_name="stock",null=True, blank=True
    )
    total_qty = models.IntegerField(default=0)
    reserved_qty = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sku.code}: {self.total_qty} (reserved {self.reserved_qty})"


class StockTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.ForeignKey(
        "catelog.SKU", on_delete=models.CASCADE, related_name="transactions"
    )
    delta = models.IntegerField()  # +10 or -5
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sku.code} | {self.delta} | {self.reason}"
