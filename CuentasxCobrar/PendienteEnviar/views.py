from django.http import HttpResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC
from django.core import serializers
from .forms import FiltrosPendientesEnviar

def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.all()
	#breakpoint()
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend})

def GetPendientesByFilters(request):
	formFiltros = FiltrosPendientesEnviar(request.GET)
	if formFiltros.is_valid():
		Cliente = formFiltros.cleaned_data["Cliente"]
		#Moneda = formFiltros.cleaned_data["Moneda"]
		Status = formFiltros.cleaned_data["Status"]
		#FechaDescargaDesde = formFiltros.cleaned_data["FechaDescargaDesde"]
		#FechaDescargaHasta = formFiltros.cleaned_data["FechaDescargaHasta"]
		PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND NombreCliente = %s", [Status, Cliente])
		return render(request, 'PendienteEnviar.html', {'pendientes':PendientesEnviar})

def GetPendientesByStatus(request):
	Status = request.GET["Status"]
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", [Status])
	jRes = serializers.serialize('json', PendientesEnviar)
	#return HttpResponse(jRes, content_type='application/json')
	return render(request, 'PendienteEnviar.html', {'pendientes':jRes})