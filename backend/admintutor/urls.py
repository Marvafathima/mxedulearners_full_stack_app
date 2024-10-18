from django.urls import path
from .views import *

urlpatterns = [
    path('approved-tutors/',ApprovedTutorListView.as_view(), name='admin_approved_tutors'),
    path('tutors/<int:pk>/toggle-active/', TutorToggleActiveView.as_view(), name='tutor-toggle-active'),
    path('current_tutor/<int:tutorId>/',CustomTutorDetailView.as_view(),name="current_tutor"),
    path('courses/', AdminCourseListView.as_view(), name='admin-course-list'),
   path('courses/<int:course_id>/', AdminCourseDetailView.as_view(), name='admin-course-detail'),
  
   ]