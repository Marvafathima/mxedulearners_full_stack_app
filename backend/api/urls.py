from django.urls import path,include
from .views import RegisterView, LoginView, AdminLogoutView,UserViewSet,VerifyOTPView,\
    AdminLoginView,AdminTokenObtainPairView, AdminTokenRefreshView,AdminTokenRefreshView,\
        TutorApplicationView,AdminMeView,StudentDetailsView, RequestPasswordResetView, PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
urlpatterns = [
    path('',include(router.urls)),
    path('register', RegisterView.as_view(), name='register'),
    path('admin/login', AdminLoginView.as_view(), name='admin_login'),
    path('verify-otp',VerifyOTPView.as_view(),name="verify-otp"),
    path('login', LoginView.as_view(), name='login'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin/token/refresh', AdminTokenRefreshView.as_view(), name='admin_token_refresh'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('tutor_application', TutorApplicationView.as_view(), name='tutor_application'),
    path('admin/me', AdminMeView.as_view(), name='admin-me'),
    path('admin/token', AdminTokenObtainPairView.as_view(), name='admin-token-obtain-pair'),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin_logout'),
    path('student/details/', StudentDetailsView.as_view(), name='student_details'),
    path('forgot_password/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('confirm_forgot_password/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
]