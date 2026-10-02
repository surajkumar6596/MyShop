from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from .views import SeachProductView,SearchHistoryRecommendationView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', SeachProductView.as_view(), name='search-products'),
    path('search-recommendations/', SearchHistoryRecommendationView.as_view(), name='search-recommendations'),
]