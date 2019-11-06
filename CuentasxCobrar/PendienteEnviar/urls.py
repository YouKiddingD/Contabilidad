from django.urls import path
from . import views

urlpatterns = [
    path("", views.GetPendientesEnviar, name='home'),
	path("FilterBy", views.GetPendientesByFilters, name='home'),
	path("SaveFactura", views.GetPendientesByFilters, name='home'),
]