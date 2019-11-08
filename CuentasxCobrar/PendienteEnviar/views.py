from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC, FacturasxCliente
from django.core import serializers
from .forms import FacturaForm
from django.template.loader import render_to_string
import json, datetime

def GetPendientesEnviar(request):
	PendingToSend = View_PendientesEnviarCxC.objects.all()
	ContadorTodos = len(list(PendingToSend))
	ContadorPendientes = len(list(View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", ['Pendiente'])))
	ContadorFinalizados = len(list(View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", ['Finalizado'])))
	ContadorConEvidencias = len(list(View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE IsEvidenciaDigital = 1")))
	ContadorSinEvidencias = ContadorTodos - ContadorConEvidencias
	return render(request, 'PendienteEnviar.html', {'pendientes':PendingToSend, 'contadorPendientes': ContadorPendientes, 'contadorFinalizados': ContadorFinalizados, 'contadorConEvidencias': ContadorConEvidencias, 'contadorSinEvidencias': ContadorSinEvidencias})



def GetPendientesByFilters(request):
	Clientes = json.loads(request.GET["Cliente"])
	Status = json.loads(request.GET["Status"])
	Moneda = request.GET["Moneda"]
	if not Status:
		QueryStatus = ""
	else:
		QueryStatus = "Status IN ({}) AND ".format(','.join(['%s' for _ in range(len(Status))]))
	if not Clientes:
		QueryClientes = ""
	else:
		QueryClientes = "NombreCliente IN ({}) AND ".format(','.join(['%s' for _ in range(len(Clientes))]))
	QueryMoneda = "Moneda = %s "
	FinalQuery = "SELECT * FROM View_PendientesEnviarCxC WHERE " + QueryStatus + QueryClientes + QueryMoneda
	params = Status + Clientes + [Moneda]
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw(FinalQuery,params)
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendientesEnviar}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def GetPendientesByStatus(request):
	Status = request.GET["Status"]
	PendientesEnviar = View_PendientesEnviarCxC.objects.raw("SELECT * FROM View_PendientesEnviarCxC WHERE Status = %s", [Status])
	htmlRes = render_to_string('TablaPendientes.html', {'pendientes':PendientesEnviar}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def SaveFactura(request):
	jParams = json.loads(request.body.decode('utf-8'))
	#formFactura = FacturaForm(jParams)
	#breakpoint()
	newFactura = FacturasxCliente()
	newFactura.Folio = jParams["FolioFactura"]
	newFactura.NombreCortoCliente = jParams["Cliente"]
	newFactura.FechaFactura = datetime.datetime.strptime(jParams["FechaFactura"],'%Y/%m/%d')
	newFactura.FechaRevision = datetime.datetime.strptime(jParams["FechaRevision"],'%Y/%m/%d')
	newFactura.FechaVencimiento = datetime.datetime.strptime(jParams["FechaVencimiento"],'%Y/%m/%d')
	newFactura.Moneda = jParams["Moneda"]
	newFactura.Subtotal = jParams["SubTotal"]
	newFactura.IVA = jParams["IVA"]
	newFactura.Retencion = jParams["Retencion"]
	newFactura.TipoCambio = jParams["TipoCambio"]
	newFactura.Comentarios = jParams["Comentarios"]
	newFactura.RutaXML = jParams["RutaXML"]
	newFactura.RutaPDF = jParams["RutaPDF"]
	newFactura.save()
	return HttpResponse('')