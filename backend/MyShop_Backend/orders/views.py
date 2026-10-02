from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Orders
from .serializers import OrderSerializer


class CreatOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Fix: context={'request': request} pass kiya taaki product image full URL ke saath mile
        serializer = OrderSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Order placed successfully", "order": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_orders(request):
    orders = Orders.objects.filter(user=request.user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            # Sirf authenticated user ka hi order fetch hoga
            order = Orders.objects.get(id=order_id, user=request.user)

            # Checking status: Only 'Pending' orders can be cancelled
            if order.status == "Pending":
                order.status = "Cancelled"
                order.save()
                return Response(
                    {"message": "Order successfully cancelled!"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": f"Cannot cancel order with status '{order.status}'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Orders.DoesNotExist:
            return Response(
                {"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND
            )
