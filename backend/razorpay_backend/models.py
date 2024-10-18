from django.db import models
from api.models import CustomUser
from courses.models import Courses

class Orders(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_payment_id = models.CharField(max_length=100)
    isPaid = models.BooleanField(default=False)
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrdersItem(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='purchased_courses')
    order = models.ForeignKey(Orders, related_name='items', on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    iscomplete=models.BooleanField(default=False)
    isstart=models.BooleanField(default=False)
    progress=models.FloatField(default=0)
    def __str__(self):
        return f"{self.course.name} in Order {self.order.id}"