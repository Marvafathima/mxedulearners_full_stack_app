from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from razorpay_backend.models import OrdersItem
from api.models import CustomUser
from courses.models import Courses
from rest_framework import serializers
import logging
from django.contrib.auth import get_user_model
from .models import Notification
User = get_user_model()
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id', 'name']

class OrderItemSerializer(serializers.ModelSerializer):
    course = CourseSerializer()

    class Meta:
        model = OrdersItem
        fields = ['course', 'price', 'iscomplete', 'isstart', 'progress']

class StudentSerializer(serializers.ModelSerializer):
    purchased_courses = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'phone_number', 'purchased_courses']

class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile_pic']
        
from .models import ChatMessage

logger = logging.getLogger(__name__)
class ChatMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.PrimaryKeyRelatedField(source='sender', queryset=User.objects.all())
    receiver_id = serializers.PrimaryKeyRelatedField(source='receiver', queryset=User.objects.all())

    class Meta:
        model = ChatMessage
        fields = ['id', 'room_name', 'message', 'timestamp', 'sender_id', 'receiver_id']
   
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'receiver', 'sender', 'message', 'time', 'notification_type', 'is_read']
        read_only_fields = ['receiver', 'sender', 'message', 'time', 'notification_type']
