from django.urls import path
from . import views

urlpatterns = [
    path('EstadosdeCuenta', views.EstadosdeCuenta, name='EstadosdeCuenta'),
]