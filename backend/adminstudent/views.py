from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from api.models import CustomUser
from .serializers import *
from django.shortcuts import get_object_or_404
class AllStudentsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        students = CustomUser.objects.filter(role='student')
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

class StudentToggleActiveView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            student = CustomUser.objects.get(pk=pk, role='student')
        except CustomUser.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        student.is_active = not student.is_active
        student.save()

        serializer = StudentSerializer(student)
        return Response(serializer.data)


class CustomUserDetailView(RetrieveAPIView):
    print("customuserdetailvide reached")
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserDetailSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_url_kwarg = 'studentid'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    # def get_object(self):
    #     user_id = self.request.query_params.get('id')
        
        # return get_object_or_404(CustomUser, id=user_id)