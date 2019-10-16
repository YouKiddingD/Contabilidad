from django.http import HttpResponse
from django.shortcuts import render




def home(request):
    datos = "Pendientes de Enviar"
    return render(request, 'PendienteEnviar.html', {'datos':datos})