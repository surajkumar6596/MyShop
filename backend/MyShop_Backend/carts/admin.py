from django.contrib import admin

# Register your models here.
from .models import CartItem

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "product", "quantity"]
    list_filter = ["user"]
    search_fields =["product__name", "user__name"]