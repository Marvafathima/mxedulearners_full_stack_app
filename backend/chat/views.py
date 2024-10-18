from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets,status,generics,serializers
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from razorpay_backend.models import OrdersItem
from api.models import CustomUser
from courses.models import Courses
from .serializers import StudentSerializer,TutorSerializer,ChatMessageSerializer,UserSerializer,NotificationSerializer
from django.http import JsonResponse
from .models import ChatMessage,Notification
import logging

from rest_framework.views import APIView
logger = logging.getLogger(__name__)
# def room(request, room_name):
#     return render(request, 'chat/room.html', {
#         'room_name': room_name
#     })
class TutorStudentsView(generics.RetrieveAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(role='student')

    def retrieve(self, request, *args, **kwargs):
        tutor_id = self.kwargs.get('tutor_id')
        tutor = get_object_or_404(CustomUser, id=tutor_id, role='tutor')
        
        # Get all courses belonging to the tutor
        tutor_courses = Courses.objects.filter(user=tutor)
        
        # Get all students who purchased these courses
        students = CustomUser.objects.filter(
            role='student',
            purchased_courses__course__in=tutor_courses
        ).distinct()

        serializer = self.get_serializer(students, many=True)
        
        return Response({
            'tutor_id': tutor.id,
            'tutor_name': tutor.username,
            'students': serializer.data
        }, status=status.HTTP_200_OK)
class StudentTutorsView(generics.RetrieveAPIView):
    serializer_class = TutorSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(role='tutor')

    def retrieve(self, request, *args, **kwargs):
        student_id = self.kwargs.get('student_id')
        student = get_object_or_404(CustomUser, id=student_id, role='student')
        
        # Get all courses purchased by the student
        purchased_courses = OrdersItem.objects.filter(user=student).values_list('course', flat=True)
        
        # Get all tutors who created these courses
        tutors = CustomUser.objects.filter(
            role='tutor',
            courses__in=purchased_courses
        ).distinct()

        serializer = self.get_serializer(tutors, many=True)
        print("\n\n\n\n\n&&&&&&&&&&&&&&&&&&&",serializer.data)
        return Response({
            'student_id': student.id,
            'student_name': student.username,
            'tutors': serializer.data
        }, status=status.HTTP_200_OK)


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    @action(detail=False, methods=['GET'])
    def chat_history(self, request):
        room_name = request.query_params.get('room_name')
        if room_name:
            messages = self.queryset.filter(room_name=room_name).order_by('timestamp')
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
        return Response({"error": "Room name is required"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def send_message(self, request):
        logger.info(f"Received data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # serializer.save()
            logger.info(f"Message saved: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MarkNotificationAsReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)
    
    def patch(self, request, *args, **kwargs):
        try:
            notification = self.get_queryset().get(pk=kwargs['pk'])
            notification.is_read = True
            notification.save()
            serializer = self.get_serializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
class ClearAllNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        notifications = Notification.objects.filter(receiver=user, is_read=False)
        
        # Mark all unread notifications as read
        notifications.update(is_read=True)

        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)


class RemoveNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        user = request.user
        notification = get_object_or_404(Notification, id=notification_id, receiver=user)

        # Mark the notification as read
        notification.is_read = True
        notification.save()

        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

