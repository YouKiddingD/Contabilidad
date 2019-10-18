from django.urls import path
from .views import pendientesenviar

urlpatterns = [
    path('', pendientesenviar),
]