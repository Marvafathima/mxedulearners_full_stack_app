from rest_framework import serializers
from .models import CustomUser
from django.utils import timezone
from datetime import timedelta
from .models import TutorApplication
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'phone_number','confirm_password', 'password', 'profile_pic', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password',None)
        user = CustomUser.objects.create_user(**validated_data)
        return user

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'is_superuser', 'is_staff')
        read_only_fields = ('is_superuser', 'is_staff')



class TutorApplicationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = TutorApplication
        fields = ['email', 'education_qualification', 'certificate', 'job_experience', 'experience_proof']

    def create(self, validated_data):
        user = self.context['user']
        email = validated_data.pop('email', None)
        return TutorApplication.objects.create(user=user, **validated_data)

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'phone_number', 'username', 'profile_pic', 'role', 'is_verified', 'is_approved']

