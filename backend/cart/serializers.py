from .models import Cart, CartItem
from rest_framework import serializers
from courses.models import Courses, Lesson
from django.contrib.auth import get_user_model
from datetime import timedelta
class CartItemSerializer(serializers.ModelSerializer):
    course = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'course', 'added_at']

    def get_course(self, obj):
        return {
            'id': obj.course.id,
            'name': obj.course.name,
            'thumbnail': obj.course.thumbnail.url if obj.course.thumbnail else None,
            'creator': obj.course.user.username,
            'price': obj.course.price,
            'offer_percentage': obj.course.offer_percentage
        }

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cartitem_set', many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items']