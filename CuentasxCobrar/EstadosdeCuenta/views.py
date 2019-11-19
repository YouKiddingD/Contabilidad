from django.shortcuts import render
from EstadosdeCuenta.models import RelacionFacturaxPartidas, View_FacturasxCliente


def EstadosdeCuenta(request):
	Facturas = View_FacturasxCliente.objects.all()
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
	QueryFecha = "FechaDescarga BETWEEN %s AND %s AND "
	FinalQuery = "SELECT * FROM View_FacturasxCliente WHERE " + QueryStatus + QueryClientes + QueryFecha + "IsAutorizada = 1"
	params = Status + Clientes + [FechaDescargaDesde, FechaDescargaHasta]
	Facturas = View_FacturasxCliente.objects.raw(FinalQuery,params)
	htmlRes = render_to_string('TablaEstadosCuenta.html', {'Facturas':Facturas}, request = request,)
	return JsonResponse({'htmlRes' : htmlRes})