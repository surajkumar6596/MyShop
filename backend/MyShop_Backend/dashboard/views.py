from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from products.models import Products
from orders.models import Orders
from carts.models import CartItem
from accounts.models import User
from  products.serializers import ProductSerializer

# --- 1. PRODUCT ADD & DELETE ---
@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Product added successfully!", "product": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_product(request, pk):
    try:
        product = Products.objects.get(pk=pk)
        product.delete()
        return Response({"message": "Product deleted successfully!"}, status=status.HTTP_200_OK)
    except Products.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


# --- 2. ALL USERS WITH FULL DETAILS ---
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_all_users(request):
    users = User.objects.all().values('id', 'username', 'email', 'first_name', 'last_name', 'phone', 'gender', 'date_joined', 'is_active')
    return Response(list(users), status=status.HTTP_200_OK)


# --- 3. ALL ORDERS WITH USER DETAILS ---
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_all_orders(request):
    orders = Orders.objects.all().select_related('user').prefetch_related('items__product').order_by('-created_at')
    
    order_list = []
    for order in orders:
        items = [{
            'product_name': item.product.name if item.product else 'Unknown',
            'price': float(item.price),
            'quantity': item.quantity
        } for item in order.items.all()]
        
        order_list.append({
            'id': order.id,
            'user_username': order.user.username if order.user else 'Guest',
            'user_email': order.user.email if order.user else '',
            'full_name': order.full_name,
            'phone': order.phone,
            'shipping_address': order.shipping_address,
            'city': order.city,
            'postal_code': order.postal_code,
            'total_amount': float(order.total_amount),
            'payment_method': order.payment_method,
            'status': order.status,
            'created_at': order.created_at,
            'items': items
        })
    return Response(order_list, status=status.HTTP_200_OK)


# --- 4. ALL ACTIVE CARTS MONITORING ---
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_all_carts(request):
    carts = CartItem.objects.all().select_related('user', 'product').order_by('-created_at')
    
    cart_list = [{
        'id': cart.id,
        'username': cart.user.username if cart.user else 'Anonymous User',
        'email': cart.user.email if cart.user else 'N/A',
        'product_name': cart.product.name,
        'product_price': float(cart.product.price),
        'quantity': cart.quantity,
        'total_price': float(cart.product.price * cart.quantity),
        'added_at': cart.created_at
    } for cart in carts]
    
    return Response(cart_list, status=status.HTTP_200_OK)



#Overview tab
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_overview_api(request):
    # 1. Key Metrics Calculations
    total_revenue = Orders.objects.filter(status='Complete').aggregate(sum=Sum('total_amount'))['sum'] or 0
    total_orders = Orders.objects.count()
    total_products = Products.objects.count()
    total_user = User.objects.count()
    
    # Agar Products model mein stock field hai, toh low stock count nikalein
    low_stock = Products.objects.filter(stock__lt=5).count() if hasattr(Products, 'stock') else 2

    # 2. Monthly Sales Revenue Chart Data
    monthly_sales = (
        Orders.objects.filter(status='Complete')
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(revenue=Sum('total_amount'), orders=Count('id'))
        .order_by('month')
    )
    
    formatted_sales = [
        {
            'month': item['month'].strftime('%b %Y') if item['month'] else 'Unknown',
            'revenue': float(item['revenue'] or 0),
            'orders': item['orders']
        }
        for item in monthly_sales
    ]
    
    # 3. Recent 5 Orders
    recent_orders = Orders.objects.order_by('-created_at')[:5].values(
        'id', 'user__username', 'total_amount', 'status', 'created_at'
    )
    
    formatted_orders = [
        {
            'id': order['id'],
            'username': order['user__username'] or 'Customer',
            'total_amount': float(order['total_amount']),
            'status': order['status'],
            'created_at': order['created_at']
        }
        for order in recent_orders
    ]
    
    return Response({
        'metrics': {
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'total_products': total_products,
            'total_user': total_user,
            'low_stock': low_stock
        },
        'monthly_sales': formatted_sales,
        'recent_orders': formatted_orders
    })