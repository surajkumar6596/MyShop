from django.urls import path
from .views import CreatOrderView, user_orders,CancelOrderView

urlpatterns = [
   path('orders/', user_orders, name='user-orders'),                       
    path('orders/checkout/', CreatOrderView.as_view(), name='checkout'),      
    path('orders/<int:order_id>/cancel/', CancelOrderView.as_view(), name='cancel-order'), 
]