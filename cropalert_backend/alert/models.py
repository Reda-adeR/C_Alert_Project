from django.db import models

# Create your models here.
from accounts.models import User

class Alert(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    publisher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')

    def __str__(self):
        return f"{self.title} - {self.publisher.username}"
