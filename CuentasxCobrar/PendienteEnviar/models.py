from django.db import models

class PendientesEnviar(models.Model):
    IDPendienteEnviar = models.AutoField(primary_key=True)
    Folio = models.CharField(max_length=10, unique=True)
    NombreCortoCliente = models.CharField(max_length=100)
    NombreCortoProveedor = models.CharField(max_length=100)
    FechaDescarga = models.CharField(max_length=100, null=True)
    Moneda = models.CharField(max_length=10)
    #Costo = models.FloatField(default=0)
    CostoSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    CostoTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    #Precio = models.FloatField(default=0)
    PrecioSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Status = models.CharField(max_length=15)
    IsFacturaCliente = models.BooleanField()
    IsFacturaProveedor = models.BooleanField()
    IsEvidenciaFisica = models.BooleanField()
    IsEvidenciaDigital = models.BooleanField()
    
    class Meta:
        db_table="PendientesEnviar"
        managed= False


class RelacionConceptoxProyecto(models.Model):
    RelacionIDConceptoxProyecto = models.AutoField(primary_key=True)
    IDPendienteEnviar = models.ForeignKey(PendientesEnviar, on_delete=models.CASCADE, db_column = 'IDPendienteEnviar')
    IDConcepto = models.IntegerField(default=0)
    IDCliente = models.IntegerField(default=0)
    IDProveedor = models.IntegerField(default=0)
    Proyecto = models.CharField(max_length=30)

    class Meta:
        db_table="RelacionConceptoxProyecto"
        managed= False


class View_PendientesEnviarCxC(models.Model):
    IDPendienteEnviar = models.ForeignKey(PendientesEnviar, on_delete=models.DO_NOTHING, db_column = 'IDPendienteEnviar', primary_key=True)
    IDConcepto = models.IntegerField(default=0)
    Folio = models.CharField(max_length=10, unique=True)
    IDCliente = models.IntegerField(default=0)
    NombreCliente = models.CharField(max_length=100)
    FechaDescarga = models.CharField(max_length=100, null=True)
    PrecioSubtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioIVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioRetencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    PrecioTotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Moneda = models.CharField(max_length=10)
    Status = models.CharField(max_length=15)
    IsEvidenciaDigital = models.BooleanField()
    IsEvidenciaFisica = models.BooleanField()
    Proyecto = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = "View_PendientesEnviarCxC"


class FacturasxCliente(models.Model):
    IDFactura = models.AutoField(primary_key=True)
    NombreCortoCliente = models.CharField(max_length=100)
    FechaFactura = models.DateTimeField()
    FechaRevision = models.DateTimeField()
    FechaVencimiento = models.DateTimeField()
    Moneda = models.CharField(max_length=10)
    Subtotal = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IVA = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Retencion = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Total = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    Saldo = models.DecimalField(default=0, max_digits=30, decimal_places=5)
    IsAutorizada = models.BooleanField()
    RutaXML = models.CharField(max_length=300)
    RutaPDF = models.CharField(max_length=300)
    TipoCambio = models.DecimalField(default=0, max_digits=10, decimal_places=5)