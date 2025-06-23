from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Alert
from .serializers import AlertSerializer


from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# This view will handle listing and creating alerts
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
            alert = serializer.save(publisher=request.user)

            # Broadcast to WebSocket group
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "alerts_group",
                {
                    "type": "newNotif",
                    "message": {
                        "type": "newNotif",
                        "sender_id": request.user.id,
                        "alert_id": alert.id,
                    }
                }
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# This view will handle filtering alerts based on area and crops
class AlertFilteredView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        area = request.query_params.get('area')
        crops = request.query_params.get('crops')

        filters = {}
        if area:
            filters['area__icontains'] = area
        if crops:
            filters['crops__icontains'] = crops

        alerts = Alert.objects.filter(**filters).order_by('-timestamp')
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data)