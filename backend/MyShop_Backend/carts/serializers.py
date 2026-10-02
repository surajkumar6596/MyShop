from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer
from .models import Products


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(), 
        source='product', 
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']


