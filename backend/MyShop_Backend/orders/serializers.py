from rest_framework import serializers
from .models import Orders, OrderItem
from products.models import Products


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    product_name = serializers.ReadOnlyField(
        source="product.title"
    )  # ya "product.name"
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "product_image", "price", "quantity"]

    def get_product_image(self, obj):
        request = self.context.get("request")
        if obj.product and hasattr(obj.product, "image") and obj.product.image:
            image_attr = obj.product.image
            image_url = (
                image_attr.url if hasattr(image_attr, "url") else str(image_attr)
            )

            if request and not image_url.startswith("http"):
                return request.build_absolute_uri(image_url)
            return image_url
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Orders
        fields = [
            "id",
            "full_name",
            "phone",
            "shipping_address",
            "city",
            "postal_code",
            "total_amount",
            "payment_method",
            "status",
            "created_at",
            "items",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Orders.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
