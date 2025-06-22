from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Alert
from .serializers import AlertSerializer

class AlertListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        alerts = Alert.objects.all().order_by('-timestamp')
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'argonome':
            return Response({'detail': 'Only agronomes can publish alerts.'}, status=status.HTTP_403_FORBIDDEN)


        serializer = AlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(publisher=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)