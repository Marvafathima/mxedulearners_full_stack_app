from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from datetime import timedelta
from django.utils import timezone
class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone_number, password=None, **extra_fields):
        if not email and not phone_number:
            raise ValueError('The Email or Phone number must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, phone_number, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    username = models.CharField(max_length=30)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('tutor', 'Tutor'),
        ('student', 'Student'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    is_rejected=models.BooleanField(default=False)
    objects = CustomUserManager()
    joined_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number','username']

    def __str__(self):
        return self.email if self.email else self.phone_number

class TutorApplication(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,related_name="education")
    education_qualification = models.TextField()
    certificate = models.FileField(upload_to='tutor_certificates/')
    job_experience = models.TextField(blank=True, null=True)
    experience_proof = models.FileField(upload_to='tutor_experience_proofs/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Application for {self.user.email}"
