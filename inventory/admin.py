from django.contrib import admin
from .models import Stock, StockTransaction

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("sku", "total_qty", "reserved_qty", "updated_at")
    search_fields = ("sku__code",)
    ordering = ("-updated_at",)

@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ("sku", "delta", "reason", "created_at")
    search_fields = ("sku__code", "reason")
    ordering = ("-created_at",)
