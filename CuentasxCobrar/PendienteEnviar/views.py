from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC
from django.core import serializers
from .forms import FiltrosPendientesEnviar
from django.template.loader import render_to_string
import json

def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.all()
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend})

def GetPendientesByFilters(request):
	Cliente = json.loads(request.GET["Cliente"])
	Status = json.loads(request.GET["Status"])
	breakpoint()
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status IN %s", params=[Status])
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendientesEnviar}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})

def GetPendientesByStatus(request):
	Status = request.GET["Status"]
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", [Status])
	jRes = serializers.serialize('json', PendientesEnviar)
	return render(request, 'PendienteEnviar.html', {'pendientes':jRes})