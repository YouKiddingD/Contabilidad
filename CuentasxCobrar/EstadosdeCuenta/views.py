from django.shortcuts import render
from EstadosdeCuenta.models import RelacionFacturaxPartidas


def EstadosdeCuenta(request):
	Facturas = RelacionFacturaxPartidas.objects.all()
	return render(request, 'EstadosdeCuenta.html', {'Facturas': Facturas})
