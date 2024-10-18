from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import CustomUser
from .serializers import *
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import RetrieveAPIView
from courses.serializers import FetchCourseSerializer,CourseSerializer,CourseDetailSerializer

class ApprovedTutorListView(APIView):
    def get(self, request):
        tutors = CustomUser.objects.filter(role='tutor', is_approved=True)
        serializer = TutorListSerializer(tutors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class TutorToggleActiveView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            tutor = CustomUser.objects.get(pk=pk, role='tutor')
        except CustomUser.DoesNotExist:
            return Response({"error": "Tutor not found"}, status=status.HTTP_404_NOT_FOUND)

        tutor.is_active = not tutor.is_active
        tutor.save()

        serializer = TutorToggleActiveSerializer(tutor)
        return Response(serializer.data)


class CustomTutorDetailView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class =TutorDetailSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_url_kwarg = 'tutorId'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    

from rest_framework import generics

class AdminCourseListView(generics.ListAPIView):
    queryset = Courses.objects.all()
    serializer_class = FetchCourseSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        # You can add additional filtering here if needed
        return queryset.select_related('user').prefetch_related('lessons')


class AdminCourseDetailView(generics.RetrieveAPIView):
    queryset=Courses.objects.all()
    serializer_class=CourseDetailSerializer
    permission_classes=[IsAdminUser]
    lookup_field = 'id'
    lookup_url_kwarg = 'course_id'
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

