from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Products
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all().order_by("-id")
    serializer_class = ProductSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q
from .models import SearchHistory


class SeachProductView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()

        # Step 1: History Tabhi Save Karo Jab User Logged-in Ho
        if query and request.user.is_authenticated:
            SearchHistory.objects.filter(user=request.user, query__iexact=query).delete()
            SearchHistory.objects.create(user=request.user, query=query)

        # Step 2: Product Search Har Kisi Ke Liye Chalna Chahiye (Logged-in + Guest)
        if query:
            products = Products.objects.filter(
                Q(title__icontains=query) | Q(description__icontains=query)
            )
        else:
            products = Products.objects.none()

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchHistoryRecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recent_queries = SearchHistory.objects.filter(user=request.user)
        history_list = [h.query for h in recent_queries]

        recommended_product = Products.objects.none()
        if history_list:
            query_filer = Q()
            for term in history_list:
                query_filer |= Q(title__icontaiens=term) | Q(
                    descriptions__icontains=term
                )

            recommended_product = Products.objects.filter(query_filer).distinct()[:8]

        product_serializer = ProductSerializer(
            recommended_product, many=True, context={"request": request}
        )

        return Response(
            {"history": history_list, "recommended_product": product_serializer.data},
            status=status.HTTP_200_OK,
        )
