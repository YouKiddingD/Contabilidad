from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def estadoscuenta(request):
	return render(request, 'EstadosCuenta.html');