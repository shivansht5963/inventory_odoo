from django.contrib import admin

from .models import Stock


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
	list_display = ("product", "warehouse", "qty", "created_at", "updated_at")
	search_fields = ("product__name", "product__sku", "warehouse__name")
	list_filter = ("warehouse",)
	raw_id_fields = ("product", "warehouse")
	ordering = ("-updated_at",)
