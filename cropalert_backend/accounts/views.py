from django.shortcuts import render

# Create your views here.
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .serializers import RegisterSerializer


from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status





# this view handles user registration
# it uses the RegisterSerializer to validate and create a new user
# if the data is valid, it returns a success message with the user ID
# if the data is invalid, it returns the errors with a 400 status code
class UserRegisterView(CreateAPIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully', 'user_id': user.id}, status=201)
        return Response(serializer.errors, status=400)
    

    # This view will handle user login
    # It will use the JWT authentication to log in the user
    # It will return a token if the login is successful
    # If the login fails, it will return an error message
class UserLoginView(CreateAPIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role,
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)