import uuid

from django.db import models


class Warehouse(models.Model):
	"""Simple warehouse model."""

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=255)
	location = models.CharField(max_length=512, blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name

	class Meta:
		indexes = [models.Index(fields=["name"]), models.Index(fields=["created_at"])]
