import pyotp
from django.core.mail import send_mail
from django.conf import settings

def generate_otp():
    totp = pyotp.TOTP(pyotp.random_base32(), interval=300)  # 5 minutes expiry
    return totp.now()

def send_otp_email(email, otp):
    subject = 'Your OTP for Registration'
    message = f'Your OTP is: {otp}. It will expire in 5 minutes.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email,]
    send_mail(subject, message, email_from, recipient_list)

def forgot_password_otp(email,otp):
    subject="Your OTP for Forgot Password"
    message= f'Your OTP is: {otp}.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email,]
    send_mail(subject, message, email_from, recipient_list)
