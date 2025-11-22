import uuid

from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
	"""Custom user model.

	- id is a UUID primary key
	- email is unique
	- role is either 'admin' or 'staff'
	- optional api_key for integrations
	- created_at timestamp
	"""

	ROLE_ADMIN = "admin"
	ROLE_STAFF = "staff"

	ROLE_CHOICES = ((ROLE_ADMIN, "admin"), (ROLE_STAFF, "staff"))

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(unique=True)
	role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_STAFF)
	api_key = models.CharField(max_length=128, blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	# Override related_name for groups and permissions to avoid reverse accessor clashes
	groups = models.ManyToManyField(
		"auth.Group",
		related_name="accounts_users",
		blank=True,
		help_text="The groups this user belongs to.",
		verbose_name="groups",
	)
	user_permissions = models.ManyToManyField(
		"auth.Permission",
		related_name="accounts_user_permissions",
		blank=True,
		help_text="Specific permissions for this user.",
		verbose_name="user permissions",
	)

	USERNAME_FIELD = "username"
	REQUIRED_FIELDS = ["email"]

	def __str__(self):
		return self.email or self.username

	class Meta:
		indexes = [models.Index(fields=["email"]), models.Index(fields=["created_at"])]
