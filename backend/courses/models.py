from django.db import models
from api.models import CustomUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import timedelta
import ffmpeg
from django.core.files.temp import NamedTemporaryFile
# Create your models here.
class Courses(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='courses')
    CATEGORY = [
        ('Full Stack Development', 'Full Stack Development'),
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('Data Science', 'Data Science'),
        ('Machine Learning', 'Machine Learning'),
        ('Cybersecurity', 'Cybersecurity'),
        ('Mobile App Development', 'Mobile App Development')
    ]
    category = models.CharField(max_length=100, choices=CATEGORY)
    price = models.FloatField(null=False, blank=False)
    offer_percentage = models.FloatField(null=True, blank=True)
    description = models.TextField(max_length=1500, null=False, blank=False)
    thumbnail = models.ImageField(upload_to='course_thumbnail/')
    points = models.PositiveIntegerField(default=0) 
    rating= models.PositiveIntegerField(default=0) 

    def __str__(self):
        return self.name

class Lesson(models.Model):
    course = models.ForeignKey(Courses, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=1000)
    description = models.TextField(max_length=1500)
    # duration = models.DurationField()  # This allows you to store time in hours, minutes, and seconds
    lesson_number = models.PositiveIntegerField()
    thumbnail = models.ImageField(upload_to='lesson_thumbnails/', null=True, blank=True)
    video = models.FileField(upload_to='lesson_videos/',default="",null=False, blank=False)  # New field for video file
    points = models.PositiveIntegerField(default=0)  # Points for individual lesson
    duration = models.DurationField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.video and not self.duration:
            # Create a temporary file to handle the video content
            with NamedTemporaryFile(delete=True) as temp_file:
                # Write video content to the temporary file
                temp_file.write(self.video.read())
                temp_file.flush()
                
                # Probe the temporary file using ffmpeg
                probe = ffmpeg.probe(temp_file.name)
                duration = float(probe['format']['duration'])
                self.duration = timedelta(seconds=duration)

        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.course.name} - Lesson {self.lesson_number}: {self.title}"


class UserProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    last_watched_position = models.DurationField(default=timedelta())
    is_completed = models.BooleanField(default=False)
    progress_percentage = models.FloatField(default=0.0)

    class Meta:
        unique_together = ['user', 'course', 'lesson']

    def __str__(self):
        return f"{self.user.username} - {self.course.name} - Lesson {self.lesson.lesson_number}"


