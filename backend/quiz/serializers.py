
from django.utils.duration import duration_string
from datetime import timedelta
from rest_framework import serializers
from .models import *
from courses.models import Courses
from courses.serializers import *
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id','text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerSerializer(many=True, source='answers', read_only=True)
    
    class Meta:
        model = Question
        fields = ['id','text', 'marks', 'negative_marks', 'options']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    time_limit = serializers.DurationField()
    creator = serializers.ReadOnlyField(source='creator.id')
    course = serializers.PrimaryKeyRelatedField(queryset=Courses.objects.all())

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'course', 'description', 'time_limit', 'questions', 'creator']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['course'] = instance.course.name  # Return course name instead of ID
        return representation


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'user', 'quiz', 'score', 'start_time', 'end_time','passed','totalattempts','percentage']
        read_only_fields = ['start_time', 'end_time','passed']


class CourseCertificateSerializer(serializers.ModelSerializer):
    course = CourseSerializer()

    class Meta:
        model = CourseCertificate
        fields = ['id', 'course', 'created_at', 'percentage_score']


class Answer2Serializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']

class Question2Serializer(serializers.ModelSerializer):
    # Nest the Answer serializer to handle question options
    options = Answer2Serializer(many=True, source='answers', required=False)

    class Meta:
        model = Question
        fields = ['id', 'text', 'marks', 'negative_marks', 'options']

    def update(self, instance, validated_data):
        # Update question fields
        instance.text = validated_data.get('text', instance.text)
        instance.marks = validated_data.get('marks', instance.marks)
        instance.negative_marks = validated_data.get('negative_marks', instance.negative_marks)
        instance.save()

        # Handle updating related answers (options)
        if 'answers' in validated_data:
            options_data = validated_data['answers']

            # Loop over existing answers and update or delete them
            existing_options = {answer.id: answer for answer in instance.answers.all()}
            for option_data in options_data:
                option_id = option_data.get('id')
                if option_id in existing_options:
                    # Update existing option
                    answer = existing_options[option_id]
                    answer.text = option_data.get('text', answer.text)
                    answer.is_correct = option_data.get('is_correct', answer.is_correct)
                    answer.save()
                    del existing_options[option_id]  # Remove from the dict to keep track of options that are left
                else:
                    # Create new option
                    Answer.objects.create(question=instance, **option_data)

            # Delete any remaining options that were not part of the update
            for answer in existing_options.values():
                answer.delete()

        return instance