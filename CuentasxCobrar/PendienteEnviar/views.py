from django.http import HttpResponse
from django.shortcuts import render
from PendienteEnviar.models import View_PendientesEnviarCxC

def home(request):
    datos = View_PendientesEnviarCxC.objects.all()
    return render(request, 'PendienteEnviar.html', {'datos':datos})