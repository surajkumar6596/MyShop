from django.contrib import admin
from .models import Products
# Register your models here.

@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('id','name','price','get_image','category')
    search_fields = ('name',)
    list_filter = ['price']

    def get_image(self,obj):
        return obj.image
    get_image.short_description = "Image Source"

