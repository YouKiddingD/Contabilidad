from django.http import HttpResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC

def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.all()
	#breakpoint()
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend})

def GetPendientesByFilters(request):
	FechaDescargaDesde = request.GET['FechaDescargaDesde']
	FechaDescargaHasta = request.GET['FechaDescargaHasta']
	Status = request.GET['Status']
	Cliente = request.GET['Cliente']
	Moneda = request.GET['Moneda']
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Moneda = %s AND Cliente = %s", [Moneda])
	breakpoint()