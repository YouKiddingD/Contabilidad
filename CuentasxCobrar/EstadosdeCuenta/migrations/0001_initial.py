# Generated by Django 2.1.13 on 2019-11-19 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FacturasxCliente',
            fields=[
                ('IDFactura', models.AutoField(primary_key=True, serialize=False)),
                ('Folio', models.CharField(max_length=50, unique=True)),
                ('NombreCortoCliente', models.CharField(max_length=100)),
                ('FechaFactura', models.DateTimeField()),
                ('FechaRevision', models.DateTimeField()),
                ('FechaVencimiento', models.DateTimeField()),
                ('Moneda', models.CharField(max_length=10)),
                ('Subtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Retencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Total', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Saldo', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IsAutorizada', models.BooleanField(default=False)),
                ('RutaXML', models.CharField(max_length=300)),
                ('RutaPDF', models.CharField(max_length=300)),
                ('TipoCambio', models.DecimalField(decimal_places=5, default=0, max_digits=10)),
                ('Comentarios', models.CharField(max_length=500)),
                ('TotalConvertido', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Status', models.CharField(default='Pendiente', max_length=15)),
            ],
            options={
                'db_table': 'FacturasxCliente',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Partida',
            fields=[
                ('IDPartida', models.AutoField(primary_key=True, serialize=False)),
                ('FechaAlta', models.DateTimeField()),
                ('FechaBaja', models.DateTimeField(blank=True, null=True)),
                ('Subtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Retencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Total', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IsActiva', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'Partida',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='RelacionFacturaxPartidas',
            fields=[
                ('IDRelacionFacturaxPartidas', models.AutoField(primary_key=True, serialize=False)),
                ('IDConcepto', models.IntegerField(default=0)),
                ('IDUsuarioAlta', models.IntegerField(default=0)),
                ('IDUsuarioBaja', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'RelacionFacturaxPartidas',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='View_FacturasxCliente',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Folio', models.CharField(max_length=50, unique=True)),
                ('Cliente', models.CharField(max_length=100)),
                ('FechaFactura', models.DateTimeField()),
                ('Subtotal', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('IVA', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Retencion', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Total', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('Saldo', models.DecimalField(decimal_places=5, default=0, max_digits=30)),
                ('RutaXML', models.CharField(max_length=300)),
                ('Status', models.CharField(max_length=15)),
                ('IsAutorizada', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'View_FacturasxCliente',
                'managed': False,
            },
        ),
    ]