from rest_framework import serializers
from courses.serializers import CourseSerializer
from .models import Orders,OrdersItem
from courses.models import Courses
from api.models import CustomUser
from api.serializer import UserSerializer
class OrderCourseSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model=Courses
        fields='__all__'
class OrdersItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdersItem
        fields = ['id', 'user', 'order', 'course', 'price', 'iscomplete', 'isstart']
        read_only_fields = ['id', 'user', 'order', 'course', 'price']
class OrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(format="%d %B %Y %I:%M %p")

    class Meta:
        model = Orders
        fields = '__all__'
        depth = 2
class OrdersitemWithOrderSerializer(serializers.ModelSerializer):
    order=OrderSerializer(read_only=True)
    course=OrderCourseSerializer(read_only=True)
    class Meta:
        model=OrdersItem
        fields='__all__'

    