from rest_framework import serializers
from api.models import CustomUser
from quiz.serializers import *
from razorpay_backend.serializers import *
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'profile_pic', 'is_active', 'joined_at']


class CustomUserDetailSerializer(serializers.ModelSerializer):
    quiz_attempts = UserQuizAttemptSerializer(many=True, read_only=True)
    course_certificates = CourseCertificateSerializer(many=True, read_only=True, source='course_certificate')
    # purchased_courses=OrdersItemSerializer(many=True, read_only=True)
    purchased_courses=OrdersitemWithOrderSerializer(many=True, read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'phone_number', 'username', 'profile_pic', 'role', 'quiz_attempts', 'purchased_courses','course_certificates']
        read_only_fields = ['id', 'email', 'phone_number', 'role']

    