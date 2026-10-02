from django.contrib import admin
from .models import Orders, OrderItem


# Order ke andar items ko tabular format me dikhane ke liye
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  
    readonly_fields = ('product', 'price', 'quantity')


@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'full_name', 'phone', 
        'total_amount', 'payment_method', 'status', 'created_at'
    )
    
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('full_name', 'phone', 'city', 'user__username', 'user__email')
    list_editable = ('status',)
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    # Fix 1: 'product_name' ki jagah 'product'
    list_display = ('id', 'order', 'product', 'price', 'quantity')
    
    # Fix 2: ForeignKey search ke liye '__name' ya '__title' use kiya
    search_fields = ('product', 'order__id')