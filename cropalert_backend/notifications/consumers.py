import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'alerts_group'

        # Add user to the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        # Notify group that a new user has joined
        self.user = self.scope['user']
        print("WebSocket connection established : ", self.user.username)
        if self.user.is_authenticated:
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'join',
                    'message': f"{self.user.username} has joined the group"
                }
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def join(self, event):
        # Send message to WebSocket
        print("msg sent to group........", event['type'], event['message'])
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'message': event['message']
        }))

    async def newNotif(self, event):
        # Send notification to WebSocket
        sender_id = event["message"].get("sender_id")
        print("self.user.id:", self.user.id)
        print("sender_id:", sender_id)
        if self.user.id == sender_id:
            return
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'message': event['message']
        }))