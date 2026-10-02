from django.db import models
from django.conf import settings
from products.models import Products


class Orders(models.Model):
    STATUS_CHOICE = (
        ('Pending', 'Pending'),
        ('Complete', 'Complete'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    shipping_address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, default="COD")
    status = models.CharField(max_length=20, default='Pending', choices=STATUS_CHOICE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Orders, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        product_title = getattr(self.product, 'title', getattr(self.product, 'name', 'Product'))
        return f"{self.quantity} x {product_title}"