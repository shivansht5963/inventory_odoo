import uuid

from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


class Stock(models.Model):
	"""Stock level per product per warehouse.

	- unique per (product, warehouse)
	- qty must be >= 0
	"""

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	product = models.ForeignKey(
		"catelog.Product",
		on_delete=models.PROTECT,
		related_name="stocks",
	)
	warehouse = models.ForeignKey(
		"warehouse.Warehouse",
		on_delete=models.PROTECT,
		related_name="stocks",
	)
	qty = models.IntegerField(validators=[MinValueValidator(0)])
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def clean(self):
		if self.qty is None:
			raise ValidationError({"qty": "Quantity must be set"})
		if self.qty < 0:
			raise ValidationError({"qty": "Stock quantity must be >= 0"})

	def save(self, *args, **kwargs):
		# run model validation to ensure qty constraint
		self.full_clean()
		super().save(*args, **kwargs)

	def __str__(self):
		return f"{self.product} @ {self.warehouse}: {self.qty}"

	class Meta:
		constraints = [
			models.UniqueConstraint(fields=["product", "warehouse"], name="unique_product_warehouse"),
		]
		indexes = [models.Index(fields=["product", "warehouse"]), models.Index(fields=["created_at"])]
