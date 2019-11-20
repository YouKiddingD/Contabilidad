$(document).ready(function()
{
  var cliente;
  var calculo =0;

//tabla estados de cuenta
var table = $('#TableEstadosdeCuenta').DataTable({
  "language": {
    "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
  },
  "responsive": true,
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
      bandera = $('input[type=hidden]').val();
      return (full[9] != 'Cobrada' ? '<input type="checkbox" name="checkEC" id="estiloCheckbox"/>': '');
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
    "targets": [8,9]

  },
  {
    "className": "dt-head-center dt-body-right",
    'width' : '5%',
    "targets": [4,5,6,7]
  },
  {
    "width": "3%",
    "className": "dt-head-center dt-body-center",
    "targets": 10,
    "mRender": function (data, type, full) {
     return '<button type ="button" class="BtnVerXML btn btn-primary btn-elevate btn-pill btn-sm" ><i class="flaticon2-file"></i></button>';
   }
 },
 {
  "width": "3%",
  "className": "dt-head-center dt-body-center",
  "targets": 11,
  "mRender": function (data, type, full) {
   return ( full[9] === 'Pendiente' ? '<button type ="button" class="BtnEliminarFactura btn btn-danger btn-elevate btn-pill btn-sm" ><i class="flaticon-delete"></i></button>':'');
 }
}
]
});


    //ejecuta varias funciones cada que el checkbox es seleccionado en la tabla estados de cuenta
    $('#TableEstadosdeCuenta').on( 'change', 'input[name="checkEC"]', function () {
      var input = 'input[name="checkEC"]';
      var btnSubir = '#BtnSubirCobros';
      if($(this).is(':checked'))
      {
        ValidacionCheckboxCobros()
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
            return fnCancelarFactura($(this).parents('tr').data('idfactura'));
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


// cerrar modal de subir facturas
$('#modalSubirCobro').on('hidden.bs.modal', function(){
 CleanModal()
 KTUppy.init()
});


//muestra los datos para la tabla del modal subir cobros al hacer click en el boton de  subir cobro
$('#BtnSubirCobros').on('click', showDatosObtenidos);

//validar el total del cobro por cada factura seleccionada -- en el modal subir cobros
$('#tableAddCobro').on("change", 'input[name="totalCobro"]', function(){
  var table = $('#tableAddCobro').DataTable();
  var datosRow = table.row($(this).parents('tr')).data();
  if(parseFloat($(this).val()) >= datosRow[2])
  {
    $(this).val(datosRow[2])
  }
  $('input#valCobro').each(function(){
   calculo = calculo + parseFloat($(this).val());
 });
  $('#AddCosto').val(calculo);
  calculo = 0;
});


//validacion si tienes los archivos pdf y xml
$('#btnSaveCobro').on('click', function(){
  if($('#kt_uppy_1').data("rutaarchivoPDF") != undefined || $('#kt_uppy_1').data("rutaarchivoXML") != undefined)
  {
    alert("puedes subir el pago");
  }
  else
  {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "200",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.error("Son necesarios los complementos PDF y XML");
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
  KTUppy.init();
});





//FUNCIONES DE ESTADOS DE CUENTA

//funcion limpiar modal
function CleanModal()
{
 $('input[name="FolioCobro"]').val('');
 $('.uploaded-files ol').remove()
 calculo = 0;
}


//obtiene los datos de cada checkbox seleccionado
function Getdatos(){
  var arrSelect=[];
  $("input[name=checkEC]:checked").each(function () {
    var datosRow = table.row($(this).parents('tr')).data();
    arrSelect.push([datosRow[1],datosRow[7], datosRow[8], datosRow[7]]);
  });
  return arrSelect;
}


//funcion para obtener los datos de la tabla Estados de cuenta para mostrarlos en la tabla del modal subir pagos
function showDatosObtenidos(){
 var datos = Getdatos();
 var TBalance=0, total=0;
 for (var i=0; i<datos.length; i++)
 {
  var Balance = parseFloat(datos[i][2]);
  var tot = parseFloat(datos[i][1]);
//  var folio = datos[i][0];
total = total + Balance;
}
var h = [datos];
$('#tableAddCobro').DataTable({
  "paging": false,
  "info":   false,
  destroy: true,
  data: h[0],
  columnDefs: [ {
    "className": "dt-head-center dt-body-right",
    "targets": 3,
    "mRender": function (data, type, full) {
     return `<input type='number' name="totalCobro" id="valCobro" value="${full[2]}">`;
   }
 }]
});
$('#AddCosto').val(total);
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
      toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "200",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };

      toastr.error("El cliente y la modena deben ser iguales");
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
  startDate = /*($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');*/"06/01/2019";
  endDate = /*($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');*/ "11/01/2019";
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
    WaitMe_Show('#divTablaFacturas');
    $('#divTablaFacturas').html(data.htmlRes);
    formatDataTable();
  }).catch(function(ex){
    console.log("no success!");
  });
}

var fnCancelarFactura = async function (IDFactura) {
  var res = false;
  jParams = {
    IDFactura: IDFactura,
  }

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
  return res;
}