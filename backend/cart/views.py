from django.shortcuts import render

# coursemanagement/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from courses.models import Courses
from .serializers import CartSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        course_id = request.data.get('course_id')
        if not course_id:
            return Response({"error": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Courses.objects.get(id=course_id)
        except Courses.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, course=course)

        if not created:
            return Response({"error": "Course already in cart"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def delete(self, request):
    #     course_id = request.data.get('course_id')
    #     if not course_id:
    #         return Response({"error": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    #     try:
    #         cart = Cart.objects.get(user=request.user)
    #         cart_item = CartItem.objects.get(cart=cart, course_id=course_id)
    #         cart_item.delete()
    #         return Response(status=status.HTTP_204_NO_CONTENT)
    #     except (Cart.DoesNotExist, CartItem.DoesNotExist):
    #         return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)
    def delete(self, request):
        cart_item_id = request.data.get('cart_item_id')
        print(cart_item_id,"this is cart item id we reciecrd$$$$$$$$$$$$$$$$$$$$$")
        if not cart_item_id:
            return Response({"error": "cart_item_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
            cart_item.delete()
            print("cart deleted")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)
class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            cartitmes=CartItem.objects.get(cart=cart)
            cart.delete()
            cartitmes.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
