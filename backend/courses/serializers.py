
from rest_framework import serializers
from .models import Courses, Lesson,UserProgress
from django.contrib.auth import get_user_model
from api.models import TutorApplication
from datetime import timedelta
from razorpay_backend.models import Orders,OrdersItem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'phone_number','profile_pic']


# class UserProgressSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProgress
#         fields = ['id', 'user', 'course', 'lesson', 'last_watched_position', 'is_completed', 'progress_percentage']
#         read_only_fields = ['user', 'course', 'lesson']
class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id','user', 'course', 'lesson', 'last_watched_position', 'is_completed', 'progress_percentage']
class LessonSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False, allow_null=True)
    course = serializers.PrimaryKeyRelatedField(queryset=Courses.objects.all())
    video = serializers.FileField(required=False, allow_null=True)
    class Meta:
        model = Lesson
        fields = ['id','course', 'title', 'description', 'duration', 'video', 'lesson_number', 'thumbnail', 'points']       
class CourseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    lessons = LessonSerializer(many=True, read_only=True)
    # user=UserSerializer(required=False)
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), required=False)

    class Meta:
        model = Courses
        fields = ['id','name', 'user', 'category', 'price', 'offer_percentage', 'description', 'thumbnail', 'points', 'rating', 'lessons']

class PurchasedLessonSerializer(serializers.ModelSerializer):
    
    thumbnail = serializers.ImageField(required=False, allow_null=True)
    course = serializers.PrimaryKeyRelatedField(queryset=Courses.objects.all())
    video = serializers.FileField(required=False, allow_null=True)
    user_progress = serializers.SerializerMethodField()
    class Meta:
        model = Lesson
        fields = ['course', 'title', 'description', 'duration', 'user_progress', 'video', 'lesson_number', 'thumbnail', 'points']       
    def get_user_progress(self, obj):
        # Assuming the request user is available in the context
        user = self.context['request'].user
        user_progress = UserProgress.objects.filter(user=user, lesson=obj).first()
        if user_progress:
            return UserProgressSerializer(user_progress).data
        return None

# class PurchasedCourseSerializer(serializers.ModelSerializer):
#     thumbnail = serializers.ImageField(required=False)
#     lessons = LessonSerializer(many=True, read_only=True, context={'request': serializers.CurrentUserDefault()})
   
#     class Meta:
#         model = Courses
#         fields = ['name', 'user', 'category', 'price', 'offer_percentage', 'description', 'thumbnail', 'points', 'rating', 'lessons']


class PurchasedCoursesSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = OrdersItem
        fields = ['id', 'course', 'price', 'iscomplete', 'isstart','progress']










class FetchCourseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    lessons = LessonSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    tutor_education = serializers.SerializerMethodField()
    class Meta:
        model = Courses
        fields = ['id','name', 'user', 'category', 'price', 'offer_percentage', 'description', 'thumbnail', 'points', 'rating', 'lessons','tutor_education']

    def get_tutor_education(self, obj):
        try:
            tutor_application = TutorApplication.objects.get(user=obj.user)
            return tutor_application.education_qualification
        except TutorApplication.DoesNotExist:
            return None
        

class LessonDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'duration', 'lesson_number', 'thumbnail', 'video_url', 'points']

class CourseDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    total_duration = serializers.SerializerMethodField()

    class Meta:
        model = Courses
        fields = ['id', 'name', 'user', 'category', 'price', 'offer_percentage', 'description', 'thumbnail', 'points', 'rating', 'lessons', 'total_duration']

    def get_total_duration(self, obj):
        return sum((lesson.duration for lesson in obj.lessons.all()), timedelta())
    
