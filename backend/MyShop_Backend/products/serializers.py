from rest_framework import serializers
from .models import Products

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ReadOnlyField()

    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "price",
            "descriptions",
            "image_file",
            "image"
        ]