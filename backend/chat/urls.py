from django.urls import path, include
from . import views
from .views import *
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'messages', ChatMessageViewSet)
urlpatterns = [
      path('tutor/<int:tutor_id>/students/', TutorStudentsView.as_view(), name='tutor_students'),
      path('student/<int:student_id>/tutors/', StudentTutorsView.as_view(), name='student_tutors'),
      # path('api/chat-history/<str:room_name>/', views.get_chat_history, name='chat_history'),
      path('', include(router.urls)),
      path('notifications/<int:pk>/', MarkNotificationAsReadView.as_view(), name='mark-notification-read'),
      path('notifications/mark-all-read',ClearAllNotificationsView.as_view(),name="clear_all_notification"),
      path('notifications/<int:notification_id>/mark-read',RemoveNotificationView.as_view(),name="remove_notification")
]