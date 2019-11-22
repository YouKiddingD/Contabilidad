from django.urls import path
from . import views

urlpatterns = [
    path('ReporteCobros', views.ReporteCobros, name='ReporteCobros'),

]
