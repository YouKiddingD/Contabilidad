from django.shortcuts import render

def ReporteCobros(request):
	Facturas = "Hello World"
	return render(request, 'ReporteCobros.html', {'Facturas': Facturas})
