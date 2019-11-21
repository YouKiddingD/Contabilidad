var table;
$(document).ready(function()
{
  var cliente;
  var calculo =0;
  var evXML;
  var idfac;
  var totConv=0;

//tabla estados de cuenta
formatDataTableFacturas();

//ejecuta varias funciones cada que el checkbox es seleccionado en la tabla estados de cuenta
$(document).on( 'change', 'input[name="checkEC"]', function () {
  var input = 'input[name="checkEC"]';
  var btnSubir = '#BtnSubirCobros';
  if($(this).is(':checked'))
  {
    ValidacionCheckboxCobros();
    Getdatos();
    ContadorCheck(input, btnSubir);
  }
  else
  {
    Getdatos();
    ContadorCheck(input, btnSubir);
  }
});

$('#BtnAplicarFiltro').on('click', fnGetFacturas);


//eliminar row de la tabla estados de cuenta
$('#TableEstadosdeCuenta').on( 'click', '.BtnEliminarFactura', function () {
 Swal.fire({
  title: '¿Estas Seguro?',
  text: "Estas a un click de eliminar algo importante",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si'
}).then(function(result) {
  if(result.value)
    return fnCancelarFactura($(this).data('idfact'));
}.bind(this)
).then((result) => {
  if (result) {
    table.row($(this).parents('tr')).remove().draw();
    Swal.fire(
      'Eliminado!',
      'Eliminado con exito',
      'success'
      )
  }
  else
    alertToastError("Error al eliminar la factura");
})
});

//elementos a mostrar al abrirse el modeal de subir cobros
$('#modalSubirCobro').on('shown.bs.modal', function(){
  $('#FechaCobro').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true
  });
  $("#FechaCobro").datepicker('setDate', 'today' );

});


//rago fecha para el Filtro
$('input[name="FiltroFechaCobros"]').daterangepicker({
 autoUpdateInput: false
});

$('input[name="FiltroFechaCobros"]').on('apply.daterangepicker', function(ev, picker) {
  $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});


// cerrar modal de subir facturas
$('#modalSubirCobro').on('hidden.bs.modal', function(){
 CleanModal()
 KTUppyEvidencias.init()
});


//muestra los datos para la tabla del modal subir cobros al hacer click en el boton de  subir cobro
$('#BtnSubirCobros').on('click', showDatosObtenidos);

//validar el total del cobro por cada factura seleccionada -- en el modal subir cobros
$('#tableAddCobro').on("change", 'input[name="totalCobro"]', function(){
  var table = $('#tableAddCobro').DataTable();
  var datosRow = table.row($(this).parents('tr')).data();
  if(parseFloat($(this).val()) >= datosRow[2])
  {
    (datosRow[3] === 'MXN') ?  $(this).val(datosRow[2]) : $(this).val(totConv)
  }
  $('input#valCobro').each(function(){
   calculo = calculo + parseFloat($(this).val());
 });
  $('#AddCosto').val(calculo);
  calculo = 0;
});


//validacion si tienes los archivos pdf y xml
$('#btnSaveCobro').on('click', function(){
  console.log($('input[name="TipoCambioCobro"]').val());
  if($('#kt_uppy_1').data("rutaarchivoPDF") != undefined || $('#kt_uppy_1').data("rutaarchivoXML") != undefined)
  {
    if($('input[name="FolioCobro"]').val() != "")
    {
      alert("puedes subir el pago");
    }
    else
    {
      alertToastError("El folio no puede estar vacio");
    }
  }
  else
  {
    alertToastError("Son necesarios los complementos PDF y XML");
  }
});


//ocultar o mostrar campos de la tabla
$('input[name="Subtotal"]').on('change', function(e){
  e.preventDefault();
  var column = table.column(4);
  column.visible( ! column.visible() );
});

$('input[name="IVA"]').on('change', function(e){
 e.preventDefault();
 var column = table.column(5);
 column.visible( ! column.visible() );
});

$('input[name="Retencion"]').on('change', function(e){
 e.preventDefault();
 var column = table.column(6);
 column.visible( ! column.visible() );
});

//inicia el modal de subir complementos
KTUtil.ready(function() {
  KTUppyEvidencias.init();
});


$('input[name="TipoCambioCobro"]').on('change', function(){
  showDatosObtenidos();
});


//FUNCIONES DE ESTADOS DE CUENTA

//funcion limpiar modal
function CleanModal()
{
 $('input[name="FolioCobro"]').val('');
 $('.uploaded-files ol').remove()
 calculo = 0;
 totConv = 0;
}


//obtiene los datos de cada checkbox seleccionado
function Getdatos(){
  var arrSelect=[];
  $("input[name=checkEC]:checked").each(function () {
    var datosRow = table.row($(this).parents('tr')).data();
    arrSelect.push([datosRow[1],datosRow[7], datosRow[8], datosRow[9], datosRow[7]]);
  });
  return arrSelect;
}


//funcion para obtener los datos de la tabla Estados de cuenta para mostrarlos en la tabla del modal subir pagos
function showDatosObtenidos(){
 var datos = Getdatos();
 var TBalance=0, total=0;
 for (var i=0; i<datos.length; i++)
 {
   if(datos[i][3] == 'MXN')
   {
     var Balance = parseFloat(datos[i][2]);
     var tot = parseFloat(datos[i][1]);
     total = total + Balance;
   }
   if(datos[i][3] == 'USD')
   {
     var tipoCambio = $('input[name="TipoCambioCobro"]').val();
     var Balance = parseFloat(datos[i][2] * tipoCambio);
     var tot = parseFloat(datos[i][1]);
     totConv = Balance;
      // datos[i].push(tot);
      total = total + Balance;
    }

  }

  var h = [datos];
  $('#tableAddCobro').DataTable({
    "paging": false,
    "info":   false,
    destroy: true,
    data: h[0],
    columnDefs: [
    {
     "className": "text-center",
     "targets": [0,3]
   },
   {
     "className": "text-right",
     "targets": [1,2]
   },
   {
    "className": "dt-head-center dt-body-right",
    "targets": 4,
    "mRender": function (data, type, full) {
     return (full[3] === 'MXN' ? `<input type="number" name="totalCobro" id="valCobro" value="${full[2]}">` : '<input type="number" name="totalCobro" id="valCobro" value="'+totConv+'">');
   }
 }]
});

  $('#AddCosto').val(truncarDecimales(total, 2));
}


//validacion mismo cliente en los checkbox
function ValidacionCheckboxCobros(){
  var checked = $("input[name='checkEC']:checked");
  $("input[name=checkEC]:checked").each(function () {
   var check = table.row($(this).parents('tr')).data();
   if(checked.length > 1)
   {
     if (check[2] != cliente /*|| check[8] != moneda*/) {
       $(this).prop('checked', false);
       alertToastError("El cliente debe ser el mismo");
     }
     else
     {
      console.log("ok");
    }
  }
  else
  {
    cliente = check[2];
   // moneda = check[8];
 }
});
}

});

var fnGetFacturas = function () {
  startDate = ($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
  endDate = ($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
  arrStatus = $('#cboStatus').val();
  arrClientes = $('#cboCliente').val();
  strMoneda = $('#rdMXN').is(':checked') ? 'MXN' : 'USD';
  WaitMe_Show('#divTablaFacturas');
  fetch("/EstadosdeCuenta/FilterBy?FechaDescargaDesde="+ startDate +"&FechaDescargaHasta="+ endDate +"&Status="+ JSON.stringify(arrStatus) +"&Cliente="+ JSON.stringify(arrClientes) +"&Moneda="+ strMoneda, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    WaitMe_Hide('#divTablaFacturas');
    $('#divTablaFacturas').html(data.htmlRes);
    formatDataTableFacturas();
  }).catch(function(ex){
    console.log("no success!");
  });
}

var fnCancelarFactura = async function (IDFactura) {
  var res = false;
  jParams = {
    IDFactura: IDFactura,
  }
  WaitMe_Show('#divTablaFacturas');
  await fetch("/EstadosdeCuenta/CancelarFactura", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jParams)
  }).then(function(response){
    if(response.status == 200)
    {
      res = true;
    }
    else if(response.status == 500)
    {
      res = false;
    }
  }).catch(function(ex){
    res = false;
  });
  WaitMe_Hide('#divTablaFacturas');
  return res;
}

function SaveCobro(){
  
}

function formatDataTableFacturas(){
  table = $('#TableEstadosdeCuenta').DataTable({
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    "responsive": false,
    "paging": false,
    "dom": 'Bfrtip',
    "buttons": [
    'excel'
    ],

    columnDefs: [ {
      orderable: false,
      targets:   0,
      "className": "dt-head-center dt-body-center",
      "width": "1%",
      "mRender": function (data, type, full) {
        idfac = $('input[name="EvidenciaXML"]').data("facturaid");
        return (full[10] != 'Cobrada' ? '<input type="checkbox" name="checkEC" id="estiloCheckbox"/>': '');
      }
    },
    {
      "name": "Status",
      "width": "5%",
      "className": "text-center bold",
      "targets": 1
    },
    {
      "name": "Status",
      "width": "10%",
      "className": "dt-head-center dt-body-center",
      "targets": [2,3]
    },
    {
      "width": "5%",
      "className": "dt-head-center dt-body-center",
      "targets": [8,9, 10]

    },
    {
      "className": "dt-head-center dt-body-right",
      'width' : '5%',
      "targets": [4,5,6,7]
    },
    {
      "width": "3%",
      "className": "dt-head-center dt-body-center",
      "targets": 11,
      "mRender": function (data, type, full) {
        evXML = $('input[name="EvidenciaXML"]').data("evidenciaxml");
        return '<a href="'+evXML+'" target="_blank" class="BtnVerXML btn btn-primary btn-elevate btn-pill btn-sm"><i class="flaticon2-file"></i></a>';
      }
    },
    {
      "width": "3%",
      "className": "dt-head-center dt-body-center",
      "targets": 12,
      "mRender": function (data, type, full) {
       return ( full[10] === 'Pendiente' ? '<button type ="button" class="BtnEliminarFactura btn btn-danger btn-elevate btn-pill btn-sm" data-idfact="'+idfac+'"><i class="flaticon-delete"></i></button>':'');
     }
   }
   ]
 });
}