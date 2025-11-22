from django.contrib import admin

from .models import (
	Receipt,
	ReceiptItem,
	Delivery,
	DeliveryItem,
	Transfer,
	TransferItem,
	Ledger,
)


class ReceiptItemInline(admin.TabularInline):
	model = ReceiptItem
	extra = 0
	raw_id_fields = ("product",)


class DeliveryItemInline(admin.TabularInline):
	model = DeliveryItem
	extra = 0
	raw_id_fields = ("product",)


class TransferItemInline(admin.TabularInline):
	model = TransferItem
	extra = 0
	raw_id_fields = ("product",)


@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
	list_display = ("id", "supplier", "warehouse", "status", "created_by", "created_at")
	search_fields = ("supplier", "created_by__email")
	list_filter = ("status", "warehouse")
	inlines = (ReceiptItemInline,)
	raw_id_fields = ("warehouse", "created_by")


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
	list_display = ("id", "customer", "warehouse", "status", "created_by", "created_at")
	search_fields = ("customer", "created_by__email")
	list_filter = ("status", "warehouse")
	inlines = (DeliveryItemInline,)
	raw_id_fields = ("warehouse", "created_by")


@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
	list_display = ("id", "from_warehouse", "to_warehouse", "status", "created_by", "created_at")
	search_fields = ("from_warehouse__name", "to_warehouse__name", "created_by__email")
	list_filter = ("status",)
	inlines = (TransferItemInline,)
	raw_id_fields = ("from_warehouse", "to_warehouse", "created_by")


@admin.register(Ledger)
class LedgerAdmin(admin.ModelAdmin):
	list_display = ("id", "product", "warehouse", "qty_change", "operation_type", "created_by", "created_at")
	search_fields = ("product__name", "product__sku", "created_by__email")
	list_filter = ("operation_type", "warehouse")
	raw_id_fields = ("product", "warehouse", "created_by")


# register items for direct access if desired
@admin.register(ReceiptItem)
class ReceiptItemAdmin(admin.ModelAdmin):
	list_display = ("id", "receipt", "product", "qty")
	raw_id_fields = ("receipt", "product")


@admin.register(DeliveryItem)
class DeliveryItemAdmin(admin.ModelAdmin):
	list_display = ("id", "delivery", "product", "qty")
	raw_id_fields = ("delivery", "product")


@admin.register(TransferItem)
class TransferItemAdmin(admin.ModelAdmin):
	list_display = ("id", "transfer", "product", "qty")
	raw_id_fields = ("transfer", "product")
