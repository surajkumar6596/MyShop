from django.db import models

# Create your models here.
from django.conf import settings
from products.models import Products


class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity= models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True )

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"



