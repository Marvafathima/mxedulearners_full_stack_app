from django.db import models

from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Courses

User = get_user_model()

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE, related_name='quizzes')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_quizzes')
    description = models.TextField(blank=True)
    time_limit = models.DurationField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Quizzes"
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    marks = models.PositiveIntegerField(default=1)
    negative_marks = models.FloatField(default=0)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.quiz.title} - Question {self.order}"

    class Meta:
        ordering = ['order']

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.text[:30]} - {'Correct' if self.is_correct else 'Incorrect'}"
User = get_user_model()

class UserQuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.FloatField()
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    passed = models.BooleanField(default=False)
    percentage=models.FloatField(default=0)
    totalattempts=models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user.username}'s attempt on {self.quiz.title}"
class CourseCertificate(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_certificate')
    course=models.ForeignKey(Courses, on_delete=models.CASCADE, related_name='certificate')
    created_at=models.DateField(auto_now_add=True)
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"{self.user.username} - {self.course.title} Certificate"