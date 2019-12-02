from PendienteEnviar.models import View_PendientesEnviarCxC
from django.shortcuts import render
from datetime import date

def Indicadores(request):
    today = date.today()
    return render(request, 'Indicadores.html', {'today': today})



def GetIndicadores(request):
	Indicadores = {}
	FinalizadosEvidencias = View_PendientesEnviarCxC(Status = 'Finalizado', IsEvidenciaDigital = True, IsEvidenciaFisica = True)