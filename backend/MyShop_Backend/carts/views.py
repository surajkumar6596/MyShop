from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CartItem  
from .serializers import CartItemSerializer  

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

        