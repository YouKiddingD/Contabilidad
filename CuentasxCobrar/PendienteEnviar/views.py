from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC
from django.core import serializers
from .forms import FiltrosPendientesEnviar
from django.template.loader import render_to_string

def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.all()
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend})

def GetPendientesByFilters(request):
	Cliente = request.GET["Cliente"]
	Status = request.GET["Status"]
	breakpoint()
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s AND NombreCliente = %s", [Status, Cliente])
	#return render(request, 'PendienteEnviar.html', {'pendientes':PendientesEnviar})
	htmlRes = render_to_string('PendienteEnviar.html', {'pendientes':PendientesEnviar}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})

def GetPendientesByStatus(request):
	Status = request.GET["Status"]
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", [Status])
	jRes = serializers.serialize('json', PendientesEnviar)
	return render(request, 'PendienteEnviar.html', {'pendientes':jRes})