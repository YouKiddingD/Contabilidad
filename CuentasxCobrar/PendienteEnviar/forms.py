from django import forms

class FiltrosPendientesEnviar(forms.Form):
	#FechaDescargaDesde = forms.CharField(max_length=100)
	#FechaDescargaHasta = forms.CharField(max_length=100)
	Status = forms.CharField(max_length=15)
	Cliente = forms.CharField(max_length=100)
	#Moneda = forms.CharField(max_length=10)