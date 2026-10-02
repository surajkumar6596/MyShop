from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Gender(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'
        OTHER = 'other', 'Other'

    phone = models.CharField(max_length=10, unique=True)
    gender = models.CharField(
        max_length=10,
        choices= Gender.choices,
        blank=True,
        null= True
    )

    def __str__(self):
        return self.username
    