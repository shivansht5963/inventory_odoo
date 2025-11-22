import uuid

from django.db import models
from django.core.validators import MinValueValidator

# fgdfdg

class Product(models.Model):
	"""Product catalog."""

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)
	sku = models.CharField(max_length=128, unique=True)
	category = models.CharField(max_length=128, blank=True, null=True)
	uom = models.CharField(max_length=64, help_text="Unit of measure")
	reorder_level = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.name} ({self.sku})"

	class Meta:
		indexes = [models.Index(fields=["sku"]), models.Index(fields=["created_at"])]


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class SKU(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        "catelog.Product", on_delete=models.CASCADE, related_name="skus"
    )
    code = models.CharField(max_length=128, unique=True)
    barcode = models.CharField(max_length=128, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code
