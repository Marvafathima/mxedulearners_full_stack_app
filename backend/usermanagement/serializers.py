
from rest_framework import serializers
from api.models import CustomUser, TutorApplication

class TutorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username']



class TutorDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = TutorApplication
        fields = ['user', 'education_qualification', 'job_experience']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'username': obj.user.username,
            'phone_number': obj.user.phone_number,
            'profile_pic': obj.user.profile_pic.url if obj.user.profile_pic else None,
            'is_approved': obj.user.is_approved,
            'is_rejected': obj.user.is_rejected
        }
    
class TutorUpdateApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorApplication
        fields = ['education_qualification', 'certificate', 'job_experience', 'experience_proof']
        extra_kwargs = {
            'certificate': {'required': False},
            'experience_proof': {'required': False},
        }
    def create(self, validated_data):
        user = self.context['request'].user
        return TutorApplication.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class TutorApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorApplication
        fields ="__all__"
class CustomUserSerializer(serializers.ModelSerializer):
    tutor_application = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'phone_number', 'username', 'profile_pic', 'role', 'is_approved', 'is_rejected', 'tutor_application']

    def get_tutor_application(self, obj):
        try:
            tutor_application = obj.education
           
            return TutorApplicationSerializer(tutor_application).data
        except TutorApplication.DoesNotExist:
            return None

# class UserUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ('username', 'email', 'phone_number')
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'phone_number')
        extra_kwargs = {
            'email': {'required': False},
            'phone_number': {'required': False}
        }

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_phone_number(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already in use.")
        return value

class PasswordUpdateSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("New passwords do not match")
        return data
class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','phone_number', 'profile_pic',]

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
class UserPreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'phone_number')
        extra_kwargs = {
            'email': {'required': False},
            'phone_number': {'required': False}
        }

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_phone_number(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already in use.")
        return value