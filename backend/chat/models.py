from django.db import models

# Create your models here.
from django.contrib.auth import get_user_model
from api.models import CustomUser
def user_directory_path(instance, filename):
    return f'chat_files/user_{instance.sender.id}/{filename}'

class ChatMessage(models.Model):
    room_name = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(CustomUser, related_name='sent_messages',default="", on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='received_messages',default="",on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path, blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f'{self.sender} to {self.receiver}: {self.message[:50]}'
    


class Notification(models.Model):
    receiver = models.ForeignKey(CustomUser, related_name="receiver_notification", on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, related_name="sender_notification", on_delete=models.CASCADE)
    message = models.TextField(max_length=2000)
    time = models.DateTimeField(auto_now_add=True)
    notification_type = models.CharField(max_length=250)
    is_read = models.BooleanField(default=False)
    message_count = models.IntegerField(default=1)  # New field to track message count

    def __str__(self):
        return f"Notification for {self.receiver.username} from {self.sender.username}"   