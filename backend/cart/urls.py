from django.urls import path
from .views import *

urlpatterns = [
    # ... other url patterns ...
    path('cart/', CartView.as_view(), name='cart'),
    path('clear-cart/', ClearCartView.as_view(), name='clear-cart'),
]