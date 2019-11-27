# Generated by Django 2.1.13 on 2019-11-19 21:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('EstadosdeCuenta', '0002_pendientesenviar'),
    ]

    operations = [
        migrations.CreateModel(
            name='RelacionConceptoxProyecto',
            fields=[
                ('RelacionIDConceptoxProyecto', models.AutoField(primary_key=True, serialize=False)),
                ('IDConcepto', models.IntegerField(default=0)),
                ('IDCliente', models.IntegerField(default=0)),
                ('IDProveedor', models.IntegerField(default=0)),
                ('Proyecto', models.CharField(max_length=30)),
            ],
            options={
                'db_table': 'RelacionConceptoxProyecto',
                'managed': False,
            },
        ),
    ]
