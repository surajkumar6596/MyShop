from django.urls import path
from .views import admin_add_product,admin_delete_product,admin_get_all_users,admin_get_all_orders,admin_get_all_carts,admin_dashboard_overview_api

urlpatterns = [
    path('admin/product/add/', admin_add_product, name='admin-add-product'),
    path('admin/product/delete/<int:pk>/', admin_delete_product, name='admin-delete-product'),
    path('admin/users/', admin_get_all_users, name='admin-get-users'),
    path('admin/orders/', admin_get_all_orders, name='admin-get-orders'),
    path('admin/carts/', admin_get_all_carts, name='admin-get-carts'),
    path('admin/dashboard/', admin_dashboard_overview_api, name='admin-get-dashbooard'),
    
]