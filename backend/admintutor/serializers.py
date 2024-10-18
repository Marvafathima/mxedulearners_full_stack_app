# serializers.py
from rest_framework import serializers
from api.models import CustomUser,TutorApplication

from courses.models import Courses
from razorpay_backend.models import OrdersItem
from django.db.models import Sum, Count,OuterRef, Subquery, DecimalField,FloatField
from django.db.models.functions import Coalesce
class TutorApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorApplication
        fields = ['id','education_qualification', 'certificate', 'job_experience', 'experience_proof', 'is_approved']

class TutorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'profile_pic', 'joined_at', 'is_active']
class TutorToggleActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'is_active']
        read_only_fields = ['id']
# class TutorDetailSerializer(serializers.ModelSerializer):
#     mycourses=CourseSerializer(many=True,read_only=True)
#     education_detail=TutorApplicationSerializer(read_only=True)
    
#     class Meta:
#         model=CustomUser
#         fields="__all__"
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id','name', 'category', 'price', 'offer_percentage', 'description', 'thumbnail', 'points', 'rating']


class TutorDetailSerializer(serializers.ModelSerializer):
    # Existing relationships
    education = TutorApplicationSerializer(read_only=True)
    courses = CourseSerializer(many=True, read_only=True)
    
    # Additional fields for total purchases, total students, and total sales
    total_purchases = serializers.SerializerMethodField()
    total_enrolled_students = serializers.SerializerMethodField()
    total_sales = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'phone_number', 'username', 'profile_pic', 'role', 'joined_at', 
                  'education', 'courses', 'total_purchases', 'total_enrolled_students', 'total_sales']

    def get_total_purchases(self, obj):
        # Get all courses created by the tutor
        tutor_courses = obj.courses.all()
        # Count total number of OrdersItem for all tutor's courses
        return OrdersItem.objects.filter(course__in=tutor_courses).count()

    def get_total_enrolled_students(self, obj):
        # Get distinct users (students) who enrolled in tutor's courses
        tutor_courses = obj.courses.all()
        return OrdersItem.objects.filter(course__in=tutor_courses).values('user').distinct().count()

    def get_total_sales(self, obj):
        # Get sum of prices for all completed orders (iscomplete=True) for tutor's courses
        tutor_courses = obj.courses.all()
        return OrdersItem.objects.filter(course__in=tutor_courses, iscomplete=True).aggregate(total_sales=Sum('price'))['total_sales'] or 0
# class TutorDetailSerializer(serializers.ModelSerializer):
#     # Use the related_name to include the tutor's application and courses
#     education = TutorApplicationSerializer(read_only=True)  # Reverse relation from TutorApplication model
#     mycourses = CourseSerializer(many=True, read_only=True)  # Reverse relation from Courses model

#     class Meta:
#         model = CustomUser
#         fields = ['id', 'email', 'phone_number', 'username', 'profile_pic', 'role', 'joined_at', 'education', 'mycourses']