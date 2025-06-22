
from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    publisher = serializers.ReadOnlyField(source='publisher.username')

    class Meta:
        model = Alert
        fields = [
            'id',
            'title',
            'description',
            'latitude',
            'longitude',
            'timestamp',
            'publisher',
            'area',
            'crops'
        ]
