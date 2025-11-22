from django.contrib import admin
from .models import Product, SKU, Category


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "sku", "category", "uom", "reorder_level", "created_at")
    search_fields = ("name", "sku", "category__name")
    list_filter = ("category",)
    ordering = ("name",)


@admin.register(SKU)
class SKUAdmin(admin.ModelAdmin):
    list_display = ("code", "product", "barcode", "created_at")
    search_fields = ("code", "product__name")
    list_filter = ("product",)
    ordering = ("code",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
