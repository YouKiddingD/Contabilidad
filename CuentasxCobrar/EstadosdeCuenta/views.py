from django.shortcuts import render
from EstadosdeCuenta.models import RelacionFacturaxPartidas, View_FacturasxCliente


def EstadosdeCuenta(request):
	Facturas = View_FacturasxCliente.objects.all()
	return render(request, 'EstadosdeCuenta.html', {'Facturas': Facturas})
