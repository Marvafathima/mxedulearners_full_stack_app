import json
import os
from decimal import Decimal

import razorpay
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Orders, OrdersItem
from courses.models import UserProgress,Courses,Lesson
from .serializers import OrderSerializer

# Load Razorpay credentials from project root .env file
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')

client = razorpay.Client(auth=(RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_payment(request):
    print(f"RAZORPAY_KEY_ID: {os.getenv('RAZORPAY_KEY_ID')}")
    print(f"RAZORPAY_KEY_SECRET: {os.getenv('RAZORPAY_KEY_SECRET')}")
    amount = request.data.get('amount')
    items = request.data.get('items', [])
    print("\n\n\n\n",amount,items,"\n\n\n")
    payment = client.order.create({
        "amount": int(Decimal(amount) * 100),
        "currency": "INR",
        "payment_capture": "1"
    })

    order = Orders.objects.create(
        user=request.user,
        order_amount=amount,
        order_payment_id=payment['id']
    )

    for item in items:
        OrdersItem.objects.create(
            user=request.user,
            order=order,
            course_id=item['course_id'],
            price=item['price']
        )
        course=Courses.objects.get(id=item['course_id'])
        lessons=Lesson.objects.filter(course=course)
        print(lessons,"these are the filtered lessons")
        for lesson in lessons:
            UserProgress.objects.create(
                course=course,lesson=lesson,user=request.user
            )

    serializer = OrderSerializer(order)

    data = {
        "payment": payment,
        "order": serializer.data
    }
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_payment_success(request):
    res = json.loads(request.data["response"])

    ord_id = res.get('razorpay_order_id')
    raz_pay_id = res.get('razorpay_payment_id')
    raz_signature = res.get('razorpay_signature')

    order = Orders.objects.get(order_payment_id=ord_id)

    data = {
        'razorpay_order_id': ord_id,
        'razorpay_payment_id': raz_pay_id,
        'razorpay_signature': raz_signature
    }

    check = client.utility.verify_payment_signature(data)

    if check is not None:
        return Response({'error': 'Something went wrong'})

    order.isPaid = True
    order.save()

    # Clear the user's cart
    cart = request.user.cart
    cart.cartitem_set.all().delete()

    return Response({'message': 'Payment successfully received!'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_payment_failure(request):
    # You can add any necessary logic here
    return Response({'message': 'Payment failed. Please try again.'})
