from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
urlpatterns = [
    path('api/users/', include('api.urls')),
    path('api/users/admin/usermanagement/', include('usermanagement.urls')),
    path('admin/', admin.site.urls),
    path('api/users/coursemanagement/',include('courses.urls')),
    path('api/users/admin/admintutor/',include('admintutor.urls')),
    path('api/users/admin/adminstudent/',include('adminstudent.urls')),
    path('api/users/quizmanagement/',include('quiz.urls')),
    path('api/users/cartmanagement/',include('cart.urls')),
    path('api/users/razorpay/',include('razorpay_backend.urls')),
    path('api/users/chat/', include('chat.urls')),
    

    # other paths
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



# http://localhost:8000/media/course_thumbnail/png-clipart-computer-icons-user-profile-info-miscellaneous-face_pxFGyDi.png