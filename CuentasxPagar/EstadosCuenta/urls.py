from django.urls import path
from .views import estadoscuenta

urlpatterns = [
    path('', estadoscuenta),
]