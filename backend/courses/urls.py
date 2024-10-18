# from django.urls import path,include
# from .views import CourseViewSet
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )
# router = DefaultRouter()
# router.register(r'courses', CourseViewSet)
# urlpatterns = [
#     path('',include(router.urls)),
#     path('register', RegisterView.as_view(), name='register'),
#     path('admin/login', AdminLoginView.as_view(), name='admin_login'),
# ]
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
# router.register(r'user-progress', UserProgressViewSet)

urlpatterns = [
    path('courses/',CourseCreateView.as_view(), name='create_course'),
    path('courses/delete/<int:course_id>/',CourseDeleteView.as_view(), name='delete_course'),
    path('courses_fetchall/', AllCoursesView.as_view(), name='all_courses'),
    path('courses_fetch_purchased/', PurchasedCoursesView.as_view(), name='purchased_courses'),
    path('tutor-courses/', TutorCoursesView.as_view(), name='tutor-courses'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('orderstatuschange/<int:course_id>/', OrderStatusUpdateView.as_view(), name='order_status_change'),
    #  path('', include(router.urls)),
    path('user-progress/<int:course_id>/<int:lesson_id>/', UserProgressView.as_view(), name='user-progress'),
    path('user-progress-list/<int:course_id>/', UserProgressListView.as_view(), name='user-progress-list'),

]