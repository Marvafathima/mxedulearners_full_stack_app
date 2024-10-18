
# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import ChatMessage,Notification
# from api.models import CustomUser
# import logging
# from django.core.files.base import ContentFile
# import base64
# from django.utils import timezone
# logger = logging.getLogger(__name__)

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'

#         # Join room group
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()
#         logger.info(f"WebSocket connection established for room: {self.room_name}")

#     async def disconnect(self, close_code):
#         # Leave room group
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )
#         logger.info(f"WebSocket connection closed for room: {self.room_name}")

    
#     async def receive(self, text_data):
#         try:
#             text_data_json = json.loads(text_data)
#             message_type = text_data_json.get('type', 'text')
#             # message = text_data_json['message']
#             sender_id = text_data_json['sender_id']  # Changed from 'sender' to 'sender_id'
#             receiver_id = text_data_json['receiver_id']

#             # Save message to database
#             if message_type == 'file':
#                 file_data = text_data_json['file']
#                 file_name = text_data_json['fileName']
#                 file_type = text_data_json['fileType']
#                 message = await self.save_file_message(sender_id, receiver_id, self.room_name, file_data, file_name, file_type)
#             else:
#                 message = text_data_json['message']
#                 await self.save_text_message(sender_id, receiver_id, self.room_name, message)

#             # await self.save_message(sender_id, receiver_id, self.room_name, message)
#             # Create notification
#             # await self.create_notification(sender_id, receiver_id, message)
#             # Create notification
#             notification = await self.create_notification(sender_id, receiver_id, message)

#             # Send message to room group
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     'type': 'chat_message',
#                     'message': message,
#                     'message_type': message_type,
#                     'file_type': file_type if message_type == 'file' else None,
#                     'sender_id': sender_id,
#                     'receiver_id': receiver_id,
#                     'timestamp': str(timezone.now())
#                 }
#             )
           
#              # Send notification to receiver's group
#             await self.channel_layer.group_send(
#                 f'user_{receiver_id}',
#                 {
#                     'type': 'notification',
#                     'notification_id': notification.id,
#                     'message': notification.message,
#                     'sender_id': sender_id,
#                     'timestamp': str(notification.time),
#                     'notification_type': notification.notification_type
#                 }
#             )
#             logger.info(f"Message received and sent to group: {self.room_group_name}")
#         except KeyError as e:
#             logger.error(f"Missing key in received data: {e}")
#         except json.JSONDecodeError:
#             logger.error("Received invalid JSON data")
#         except Exception as e:
#             logger.error(f"Error in receive method: {e}")
 
#     async def chat_message(self, event):
#         message = event['message']
#         sender_id = event['sender_id']
#         receiver_id = event['receiver_id']  # Include receiver_id
#         message_type = event['message_type']
#         file_type = event.get('file_type')
#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'sender_id': sender_id,
#             'receiver_id': receiver_id,
#             'message_type': message_type,
#             'file_type': file_type
              
              
#                 # Include receiver_id
#         }))
#     @database_sync_to_async
#     def create_notification(self, sender_id, receiver_id, message):
#         try:
#             sender = CustomUser.objects.get(id=sender_id)
#             receiver = CustomUser.objects.get(id=receiver_id)
#             Notification.objects.create(
#                 receiver=receiver,
#                 sender=sender,
#                 message=f"New message from {sender.username}: {message[:50]}...",
#                 notification_type='chat',
#                 is_read=False,
#                 time=timezone.now()
#             )
#             logger.info(f"Notification created for user {receiver_id}")
#         except Exception as e:
#             logger.error(f"Error creating notification: {e}")
#             return None
#     async def notification(self, event):
#         # Send notification to WebSocket
#         await self.send(text_data=json.dumps({
#              'type': 'notification',
#             'notification_id': event['notification_id'],
#             'message': event['message'],
#             'sender_id': event['sender_id'],
#             'timestamp': event['timestamp'],
#             'notification_type': event['notification_type']
#         }))
#     @database_sync_to_async
#     def mark_notification_as_read(self, notification_id):
#         try:
#             notification = Notification.objects.get(id=notification_id)
#             notification.is_read = True
#             notification.save()
#             logger.info(f"Notification {notification_id} marked as read")
#         except Notification.DoesNotExist:
#             logger.error(f"Notification {notification_id} not found")
#         except Exception as e:
#             logger.error(f"Error marking notification as read: {e}")

#     async def read_notification(self, text_data):
#         try:
#             data = json.loads(text_data)
#             notification_id = data['notification_id']
#             await self.mark_notification_as_read(notification_id)
#         except Exception as e:
#             logger.error(f"Error in read_notification method: {e}")


#     @database_sync_to_async
#     def save_text_message(self, sender_id, receiver_id, room_name, message):
#         try:
#             sender = CustomUser.objects.get(id=sender_id)
#             receiver = CustomUser.objects.get(id=receiver_id)
#             ChatMessage.objects.create(
#                 sender=sender,
#                 receiver=receiver,
#                 room_name=room_name,
#                 message=message
#             )
#             logger.info(f"Message saved to database: {message[:50]}...")
#         except CustomUser.DoesNotExist:
#             logger.error(f"User not found. Sender ID: {sender_id}, Receiver ID: {receiver_id}")
#         except Exception as e:
#             logger.error(f"Error saving message to database: {e}")


#     @database_sync_to_async
#     def save_file_message(self, sender_id, receiver_id, room_name, file_data, file_name, file_type):
#         try:
#             sender = CustomUser.objects.get(id=sender_id)
#             receiver = CustomUser.objects.get(id=receiver_id)
            
#             # Decode the base64 file data
#             format, filestr = file_data.split(';base64,')
#             ext = file_name.split('.')[-1]
#             data = ContentFile(base64.b64decode(filestr), name=f'{file_name}')
            
#             chat_message = ChatMessage.objects.create(
#                 sender=sender,
#                 receiver=receiver,
#                 room_name=room_name,
#                 message=f"File: {file_name}",
#                 file=data,
#                 file_type=file_type
#             )
#             logger.info(f"File message saved to database: {file_name}")
#             return chat_message.file.url
#         except Exception as e:
#             logger.error(f"Error saving file message to database: {e}")
#             return None


import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage, Notification
from api.models import CustomUser
import logging
from django.utils import timezone
from django.db.models import F
from django.core.files.base import ContentFile
import base64
from django.core.serializers.json import DjangoJSONEncoder
logger = logging.getLogger(__name__)

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()
#         logger.info(f"WebSocket connection established for room: {self.room_name}")

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
#         logger.info(f"WebSocket connection closed for room: {self.room_name}")

#     async def receive(self, text_data):
#         try:
#             text_data_json = json.loads(text_data)
#             message_type = text_data_json.get('type', 'text')
#             sender_id = text_data_json['sender_id']
#             receiver_id = text_data_json['receiver_id']

#             if message_type == 'file':
#                 file_data = text_data_json['file']
#                 file_name = text_data_json['fileName']
#                 file_type = text_data_json['fileType']
#                 message = await self.save_file_message(sender_id, receiver_id, self.room_name, file_data, file_name, file_type)
#             else:
#                 message = text_data_json['message']
#                 await self.save_text_message(sender_id, receiver_id, self.room_name, message)

#             # Create or update notification
#             notification = await self.create_or_update_notification(sender_id, receiver_id, message)

#             # Send message to room group
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     'type': 'chat_message',
#                     'message': message,
#                     'message_type': message_type,
#                     'file_type': file_type if message_type == 'file' else None,
#                     'sender_id': sender_id,
#                     'receiver_id': receiver_id,
#                     'timestamp': str(timezone.now())
#                 }
#             )

#             # Send notification to receiver's group
#             await self.channel_layer.group_send(
#                 f'user_{receiver_id}',
#                 {
#                     'type': 'notification',
#                     'notification_id': notification.id,
#                     'message': notification.message,
#                     'sender_id': sender_id,
#                     'timestamp': str(notification.time),
#                     'notification_type': notification.notification_type,
#                     'message_count': notification.message_count
#                 }
#             )
#             logger.info(f"Message received and sent to group: {self.room_group_name}")
#         except Exception as e:
#             logger.error(f"Error in receive method: {e}")

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event))
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = f'user_{self.user_id}'
        
        # Add the user to their personal group
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        
        await self.accept()
        logger.info(f"WebSocket connection established for user: {self.user_id}")

    async def disconnect(self, close_code):
        # Remove the user from their personal group
        await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
        logger.info(f"WebSocket connection closed for user: {self.user_id}")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type', 'chat_message')
            print(text_data_json,message_type,"this is the data")
            if message_type == 'chat_message':
                await self.handle_chat_message(text_data_json)
                print("not a problem here")
            # Add other message types here if needed

        except Exception as e:
            logger.error(f"Error in receive method: {str(e)}", exc_info=True)
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'An error occurred while processing your message.'
            }))
    async def handle_chat_message(self, data):
        try:
            sender_id = data['sender_id']
            receiver_id = data['receiver_id']
            room_name = f"{max(sender_id, receiver_id)}_{min(sender_id, receiver_id)}"
            message_type = data.get('message_type', 'text')

            if message_type == 'file':
                file_data = data['file']
                file_name = data['fileName']
                file_type = data['fileType']
                message = await self.save_file_message(sender_id, receiver_id, room_name, file_data, file_name, file_type)
            else:
                message = data['message']
                await self.save_text_message(sender_id, receiver_id, room_name, message)

            # Create or update notification
            notification = await self.create_or_update_notification(sender_id, receiver_id, message)
            print("the part after notification function return")
            # Ensure message and notification are serializable
            serializable_message = self.serialize_message(message)
            serializable_notification = self.serialize_notification(notification)

            
            # Send message to both sender and receiver groups
            chat_message = {
                'type': 'chat_message',
                'message': serializable_message,
                'message_type': message_type,
                'file_type': file_type if message_type == 'file' else None,
                'sender_id': sender_id,
                'receiver_id': receiver_id,
                'room_name': room_name,
                'timestamp': str(timezone.now())
            }
            print(chat_message,"chat message to be send to te reciever and sender")
            await self.channel_layer.group_send(f'user_{sender_id}', chat_message)
            await self.channel_layer.group_send(f'user_{receiver_id}', chat_message)
            print("done 341")
            print("line 351 :",serializable_notification)
            # Send notification to receiver's group
            await self.channel_layer.group_send(
                f'user_{receiver_id}',
                {
                    'type': 'notification',
                    'notification': serializable_notification
                    # 'notification_id': notification.id,
                    # 'message': notification.message,
                    # 'sender_id': sender_id,
                    # 'timestamp': str(notification.time),
                    # 'notification_type': notification.notification_type,
                    # 'message_count': notification.message_count
                }
            )
            
            logger.info(f"Chat message handled for room: {room_name}")
        except Exception as e:
            logger.error(f"Error in handle_chat_message: {str(e)}", exc_info=True)
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'An error occurred while processing your chat message.'
            }))
    @staticmethod
    def serialize_message(message):
        # If message is already a string, return it as is
        if isinstance(message, str):
            return message
        # If it's a model instance, convert it to a dictionary
        if hasattr(message, '__dict__'):
            return {
                'id': message.id,
                'content': message.content,
                'timestamp': str(message.timestamp),
                # Add other fields as needed
            }
        # If it's something else, convert to string
        return str(message)

    @staticmethod
    def serialize_notification(notification):
        return {
            'id': notification.id,
            'message': notification.message,
            'sender_id': notification.sender_id,
            'timestamp': str(notification.time),
            'notification_type': notification.notification_type,
            'message_count': notification.message_count
        }

    async def chat_message(self, event):
        print("chat message functioncalled")
        await self.send(text_data=json.dumps(event, cls=DjangoJSONEncoder))

    async def notification(self, event):
        print("chat message functioncalled")
        await self.send(text_data=json.dumps(event, cls=DjangoJSONEncoder))

    # async def chat_message(self, event):
    #     await self.send(text_data=json.dumps(event))

    # async def notification(self, event):
    #     await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def create_or_update_notification(self, sender_id, receiver_id, message):
        try:
            sender = CustomUser.objects.get(id=sender_id)
            receiver = CustomUser.objects.get(id=receiver_id)
            notification, created = Notification.objects.get_or_create(
                receiver=receiver,
                sender=sender,
                notification_type='chat',
                is_read=False,
                defaults={
                    'message': f"New message from {sender.username}: {message[:50]}...",
                    'time': timezone.now(),
                }
            )
            if not created:
                # notification.message_count = F('message_count') + 1
                notification.message_count +=1
                notification.message = f"{notification.message_count} new messages from {sender.username}"
                notification.time = timezone.now()
                notification.save()
            logger.info(f"Notification created/updated for user {receiver_id}")
            return notification
        except Exception as e:
            logger.error(f"Error creating/updating notification: {e}")
            return None

    # async def notification(self, event):
    #     await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.is_read = True
            notification.save()
            logger.info(f"Notification {notification_id} marked as read")
        except Notification.DoesNotExist:
            logger.error(f"Notification {notification_id} not found")
        except Exception as e:
            logger.error(f"Error marking notification as read: {e}")

    async def read_notification(self, text_data):
        try:
            data = json.loads(text_data)
            notification_id = data['notification_id']
            await self.mark_notification_as_read(notification_id)
        except Exception as e:
            logger.error(f"Error in read_notification method: {e}")

    # ... (rest of the methods remain unchanged)


    @database_sync_to_async
    def save_text_message(self, sender_id, receiver_id, room_name, message):
        try:
            sender = CustomUser.objects.get(id=sender_id)
            receiver = CustomUser.objects.get(id=receiver_id)
            ChatMessage.objects.create(
                sender=sender,
                receiver=receiver,
                room_name=room_name,
                message=message
            )
            logger.info(f"Message saved to database: {message[:50]}...")
        except CustomUser.DoesNotExist:
            logger.error(f"User not found. Sender ID: {sender_id}, Receiver ID: {receiver_id}")
        except Exception as e:
            logger.error(f"Error saving message to database: {e}")


    @database_sync_to_async
    def save_file_message(self, sender_id, receiver_id, room_name, file_data, file_name, file_type):
        try:
            sender = CustomUser.objects.get(id=sender_id)
            receiver = CustomUser.objects.get(id=receiver_id)
            
            # Decode the base64 file data
            format, filestr = file_data.split(';base64,')
            ext = file_name.split('.')[-1]
            data = ContentFile(base64.b64decode(filestr), name=f'{file_name}')
            
            chat_message = ChatMessage.objects.create(
                sender=sender,
                receiver=receiver,
                room_name=room_name,
                message=f"File: {file_name}",
                file=data,
                file_type=file_type
            )
            logger.info(f"File message saved to database: {file_name}")
            return chat_message.file.url
        except Exception as e:
            logger.error(f"Error saving file message to database: {e}")
            return None



    @database_sync_to_async
    def delete_notification(self, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.delete()
            logger.info(f"Notification {notification_id} deleted")
        except Notification.DoesNotExist:
            logger.error(f"Notification {notification_id} not found")
        except Exception as e:
            logger.error(f"Error deleting notification: {e}")

    async def close_notification(self, text_data):
        try:
            data = json.loads(text_data)
            notification_id = data['notification_id']
            await self.delete_notification(notification_id)
        except Exception as e:
            logger.error(f"Error in close_notification method: {e}")



# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import ChatMessage,Notification
# from api.models import CustomUser
# import logging
# from django.core.files.base import ContentFile
# import base64
# from django.utils import timezone
# logger = logging.getLogger(__name__)

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'

#         # Join room group
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()
#         logger.info(f"WebSocket connection established for room: {self.room_name}")

#     async def disconnect(self, close_code):
#         # Leave room group
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )
#         logger.info(f"WebSocket connection closed for room: {self.room_name}")

    
#     async def receive(self, text_data):
#         try:
#             text_data_json = json.loads(text_data)
#             message_type = text_data_json.get('type', 'text')
#             # message = text_data_json['message']
#             sender_id = text_data_json['sender_id']  # Changed from 'sender' to 'sender_id'
#             receiver_id = text_data_json['receiver_id']

#             # Save message to database
#             if message_type == 'file':
#                 file_data = text_data_json['file']
#                 file_name = text_data_json['fileName']
#                 file_type = text_data_json['fileType']
#                 message = await self.save_file_message(sender_id, receiver_id, self.room_name, file_data, file_name, file_type)
#             else:
#                 message = text_data_json['message']
#                 await self.save_text_message(sender_id, receiver_id, self.room_name, message)

#             # await self.save_message(sender_id, receiver_id, self.room_name, message)

#             # Send message to room group
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     'type': 'chat_message',
#                     'message': message,
#                     'message_type': message_type,
#                     'file_type': file_type if message_type == 'file' else None,
#                     'sender_id': sender_id,
#                     'receiver_id': receiver_id
#                 }
#             )
#             logger.info(f"Message received and sent to group: {self.room_group_name}")
#         except KeyError as e:
#             logger.error(f"Missing key in received data: {e}")
#         except json.JSONDecodeError:
#             logger.error("Received invalid JSON data")
#         except Exception as e:
#             logger.error(f"Error in receive method: {e}")
 
#     async def chat_message(self, event):
#         message = event['message']
#         sender_id = event['sender_id']
#         receiver_id = event['receiver_id']  # Include receiver_id
#         message_type = event['message_type']
#         file_type = event.get('file_type')
#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'sender_id': sender_id,
#             'receiver_id': receiver_id,
#             'message_type': message_type,
#             'file_type': file_type
              
              
#                 # Include receiver_id
#         }))

#     @database_sync_to_async
#     def save_text_message(self, sender_id, receiver_id, room_name, message):
#         try:
#             sender = CustomUser.objects.get(id=sender_id)
#             receiver = CustomUser.objects.get(id=receiver_id)
#             ChatMessage.objects.create(
#                 sender=sender,
#                 receiver=receiver,
#                 room_name=room_name,
#                 message=message
#             )
#             logger.info(f"Message saved to database: {message[:50]}...")
#         except CustomUser.DoesNotExist:
#             logger.error(f"User not found. Sender ID: {sender_id}, Receiver ID: {receiver_id}")
#         except Exception as e:
#             logger.error(f"Error saving message to database: {e}")


#     @database_sync_to_async
#     def save_file_message(self, sender_id, receiver_id, room_name, file_data, file_name, file_type):
#         try:
#             sender = CustomUser.objects.get(id=sender_id)
#             receiver = CustomUser.objects.get(id=receiver_id)
            
#             # Decode the base64 file data
#             format, filestr = file_data.split(';base64,')
#             ext = file_name.split('.')[-1]
#             data = ContentFile(base64.b64decode(filestr), name=f'{file_name}')
            
#             chat_message = ChatMessage.objects.create(
#                 sender=sender,
#                 receiver=receiver,
#                 room_name=room_name,
#                 message=f"File: {file_name}",
#                 file=data,
#                 file_type=file_type
#             )
#             logger.info(f"File message saved to database: {file_name}")
#             return chat_message.file.url
#         except Exception as e:
#             logger.error(f"Error saving file message to database: {e}")
#             return None
# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         try:
#             self.user_id = self.scope['url_route']['kwargs']['user_id']
#             logger.info(f"Attempting connection for user: {self.user_id}")
#             self.user_group_name = f'user_{self.user_id}'
            
#             await self.channel_layer.group_add(
#                 self.user_group_name,
#                 self.channel_name
#             )
            
#             await self.accept()
#             logger.info(f"Connection accepted for user: {self.user_id}")
#         except Exception as e:
#             logger.error(f"Connection error: {str(e)}")
#             raise
#     # async def connect(self):
#     #     self.user_id = self.scope['url_route']['kwargs']['user_id']
#     #     self.user_group_name = f'user_{self.user_id}'

#     #     # Join user's notification group
#     #     await self.channel_layer.group_add(
#     #         self.user_group_name,
#     #         self.channel_name
#     #     )

#     #     await self.accept()
#     #     logger.info(f"WebSocket connection established for user fro notification: {self.user_id}")

#     async def disconnect(self, close_code):
#         # Leave user's notification group
#         await self.channel_layer.group_discard(
#             self.user_group_name,
#             self.channel_name
#         )
#         logger.info(f"WebSocket connection closed for user: {self.user_id}")

#     async def notification(self, event):
#         # Send notification to WebSocket
#         await self.send(text_data=json.dumps({
#             'type': 'notification',
#             'notification_id': event['notification_id'],
#             'message': event['message'],
#             'sender_id': event['sender_id'],
#             'timestamp': event['timestamp'],
#             'notification_type': event['notification_type']
#         }))

#     @database_sync_to_async
#     def create_notification(self, sender_id, receiver_id, message):
#         try:
#             sender = CustomUser.objects.get(id=sender_id)
#             receiver = CustomUser.objects.get(id=receiver_id)
#             Notification.objects.create(
#                 receiver=receiver,
#                 sender=sender,
#                 message=f"New message from {sender.username}: {message[:50]}...",
#                 notification_type='chat',
#                 is_read=False,
#                 time=timezone.now()
#             )
#             logger.info(f"Notification created for user {receiver_id}")
#         except Exception as e:
#             logger.error(f"Error creating notification: {e}")