from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import User  # Assuming User is your custom user model


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username       =      validated_data['username'],
            email          =      validated_data['email'],
            password       =      validated_data['password'],
            role           =      validated_data['role']
        )
        return user