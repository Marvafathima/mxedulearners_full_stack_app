from rest_framework import generics, status,viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializer import UserSerializer,OTPVerificationSerializer,TutorApplicationSerializer,AdminSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from .utils import generate_otp, send_otp_email
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .models import TutorApplication
from rest_framework_simplejwt.views import TokenRefreshView
from .serializer import StudentSerializer
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
           
            otp = generate_otp()
            if 'registration_data' in request.session:
                del request.session['registration_data']
            request.session['registration_data'] = {
                'data': serializer.validated_data,
                'otp': otp
            }
            request.session.save()
          
            print(f"OTP for {serializer.validated_data['email']}: {otp}")  # For development
            send_otp_email(serializer.validated_data['email'], otp)
            return Response({"message": "Please verify your email with the OTP sent.",
                "email": serializer.validated_data['email'],
                "role": serializer.validated_data['role']}, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            session_data = request.session.get('registration_data')
            if not session_data or session_data['otp'] != otp:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
            user_data = session_data['data']
           
            user_data.pop('confirm_password', None)
            user = CustomUser.objects.create_user(**user_data)
            user.is_verified = True
            user.is_approved = user.role != 'tutor'
            print("user saved success")
            del request.session['registration_data'] 
            user.save()
            
            if user.role == 'tutor':
                print("user not approved")
               
                return Response({
                    "message": "Email verified successfully. Please complete your tutor application.",
                    "user": {
                    "id": user.id,
                    "email": user.email,
                     "role": user.role
                } 
                }, status=status.HTTP_201_CREATED)
            refresh = RefreshToken.for_user(user)
           
            return Response({
                "message": "Email verified successfully. User registered.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                     "role": user.role
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            print("login called")
            email = request.data.get('email')
            password = request.data.get('password')
            user = CustomUser.objects.filter(email=email).first()
            if not user.is_active:
                return Response({
                    'detail':"Sorry Admin Blocked you"
                },status=status.HTTP_401_UNAUTHORIZED)
            if user and user.check_password(password) and user.is_approved:
                refresh = RefreshToken.for_user(user)
                print("refresh token generated")
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                })
            elif user and user.check_password(password) and user.is_approved==False:
                return Response({
                    'detail':"Admin Approval pending"
                },status=status.HTTP_401_UNAUTHORIZED)
            elif user and user.check_password(password) and user.is_rejected==False:
                return Response({
                    'detail':"Sorry,Admin rejected your application"
                },status=status.HTTP_401_UNAUTHORIZED)
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
      

class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(password,"admin password recieved")
        # Authenticate user
        user = authenticate(request, email=email, password=password)
        
        if user and user.is_superuser:
            # Generate tokens
            print("tokenis generated")
            refresh = RefreshToken.for_user(user)
            return Response({
                'isAdmin': user.is_superuser,
                'access': str(refresh.access_token), 
                'refresh': str(refresh),
                 'user': UserSerializer(user).data # You may or may not need this based on your setup
            }, status=status.HTTP_200_OK)
        
        return Response({'detail': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

# class AdminTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         if response.status_code == 200:
#             user = request.user
#             if user.is_superuser:
#                 return response
#         return Response({'detail': 'Not an admin'}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class AdminTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except (InvalidToken, TokenError):
            return Response({'detail': 'Invalid token or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)
class TutorApplicationView(APIView):
  
    def post(self, request):
        email = request.data.get('email')
        print("application clled")
        if not email:
            return Response({"detail": "Email is required to apply."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
            print(user.email,"sucsse$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found. Please register first."}, status=status.HTTP_404_NOT_FOUND)
        
        if user.role != 'tutor':
            return Response({"detail": "Only tutors can submit this application."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if a TutorApplication already exists for this user
        if TutorApplication.objects.filter(user=user).exists():
            return Response({"detail": "You have already submitted an application."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = TutorApplicationSerializer(data=request.data, context={'user': user})
     
        if serializer.is_valid():
            serializer.save()
            print("Tutor application submitted successfully. Waiting for admin approval.")
            return Response({
                "message": "Tutor application submitted successfully. Waiting for admin approval.",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class AdminMeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        user = request.user
        if user.is_superuser:
            serializer = AdminSerializer(user)
            return Response(serializer.data)
        else:
            return Response({"detail": "You do not have permission to access this resource."},
                            status=status.HTTP_403_FORBIDDEN)
# views.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.response import Response
from rest_framework import status

class AdminTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
     
        if not serializer.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class AdminTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
class AdminLogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            print("successfully logged out")
            # token.blacklist()
            print("logged outttt")
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("exception is working here")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StudentDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'student':
            return Response({"error": "User is not a student"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = StudentSerializer(user)
        return Response(serializer.data)


#forgot password functions
from .utils import forgot_password_otp
class RequestPasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user =  CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        otp=generate_otp()
        print("\n\n\n\n\n otp for forgot password",otp)
        user.otp=otp
        user.save()
        forgot_password_otp(email,otp)
        return Response({"message": "Password reset OTP has been sent to your email."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        try:
            user = CustomUser.objects.get(email=email, otp=otp)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid email or OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.otp = None  # Clear the OTP
        user.save()

        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)