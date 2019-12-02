from django.urls import path
from . import views

urlpatterns = [
    path("", views.GetPendientesEnviar, name='PendintesEnviar'),
    path("", views.GetPendientesEnviar, name='ReporteCobros'),
    path("", views.GetPendientesEnviar, name='ReporteCanceladas'),
	path("FilterBy", views.GetPendientesByFilters, name='FilterBy'),
	path("SaveFactura", views.SaveFactura, name='SaveFactura'),
	path("SavePartidasxFactura", views.SavePartidasxFactura, name='SavePartidasxFactura'),
]