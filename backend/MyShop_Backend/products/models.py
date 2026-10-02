from django.db import models
from django.conf import settings
# Create your models here.
class Products(models.Model):
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Clothes', 'Clothes'),
        ('Fashion', 'Fashion'),
        ('Grocery', 'Grocery'),
        ('Toys', 'Toys'),
        ('Kids', 'Kids'),
    ]

    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Clothes')

    name = models.CharField(max_length=300)
    price = models.DecimalField(max_digits=10 , decimal_places=2)
    descriptions = models.TextField()
    

    image_file = models.ImageField(upload_to='products/', blank=True, null=True )
    image_url = models.URLField(blank=True, null=True)

    @property
    def image(self):
        if self.image_file:
            return self.image_file.url
        elif self.image_url:
            return self.image_url
        return None
    
    def __str__(self):
        return self.name


class SearchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='search')
    query = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=['-created_at']
    def __str__(self):
        return f"{self.user.username} - {self.query}"
        


