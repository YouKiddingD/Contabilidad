from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from EstadosdeCuenta.models import RelacionFacturaxPartidas, View_FacturasxCliente, PendientesEnviar, RelacionConceptoxProyecto
from django.template.loader import render_to_string
import json, datetime


def EstadosdeCuenta(request):
	Facturas = View_FacturasxCliente.objects.exclude(Status = "Cancelada")
	return render(request, 'EstadosdeCuenta.html', {'Facturas': Facturas})



def GetFacturasByFilters(request):
	FechaDescargaDesde = request.GET["FechaDescargaDesde"]
	FechaDescargaHasta = request.GET["FechaDescargaHasta"]
	Clientes = json.loads(request.GET["Cliente"])
	Status = json.loads(request.GET["Status"])
	if not Status:
		QueryStatus = ""
	else:
		QueryStatus = "Status IN ({}) AND ".format(','.join(['%s' for _ in range(len(Status))]))
	if not Clientes:
		QueryClientes = ""
	else:
		QueryClientes = "Cliente IN ({}) AND ".format(','.join(['%s' for _ in range(len(Clientes))]))
	QueryFecha = "FechaFactura BETWEEN %s AND %s AND "
	FinalQuery = "SELECT * FROM View_FacturasxCliente WHERE " + QueryStatus + QueryClientes + QueryFecha + "IsAutorizada = 0"
	params = Status + Clientes + [FechaDescargaDesde, FechaDescargaHasta]
	Facturas = View_FacturasxCliente.objects.raw(FinalQuery,params)
	htmlRes = render_to_string('TablaEstadosCuenta.html', {'Facturas':Facturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})



def CancelarFactura(request):
	IDFactura = request.GET["IDFactura"]
	conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = IDFactura)
	if conRelacionFacturaxPartidas:
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.Status = 'Cancelada'
		conRelacionFacturaxPartidas[0].IDFacturaxCliente.save()
		for Partida in conRelacionFacturaxPartidas:
			Partida.IDPartida.IsActiva = False
			Partida.IDPartida.FechaBaja = datetime.datetime.now()
			conPendienteEnviar = RelacionConceptoxProyecto.objects.get(IDConcepto = Partida.IDConcepto)
			conPendienteEnviar.IDPendienteEnviar.IsFacturaCliente = False
			conPendienteEnviar.IDPendienteEnviar.save()
			Partida.IDPartida.save()
	return HttpResponse("")



def GetDetallesFactura(request):
	ListaViajes = list()
	IDFactura = request.GET["IDFactura"]
	conRelacionFacturaxPartidas = RelacionFacturaxPartidas.objects.filter(IDFacturaxCliente = IDFactura)
	if conRelacionFacturaxPartidas:
		for Partida in conRelacionFacturaxPartidas:
			ListaViajes.append(RelacionConceptoxProyecto.objects.get(IDConcepto = Partida.IDConcepto))
	htmlRes = render_to_string('TablaDetallesFactura.html', {'Pendientes':ListaViajes}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})