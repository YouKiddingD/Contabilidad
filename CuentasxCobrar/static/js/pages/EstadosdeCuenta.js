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

     columnDefs: [ {
      orderable: false,
      targets:   0,
      "className": "dt-head-center dt-body-center",
      "width": "1%",
      "mRender": function (data, type, full) {
        bandera = $('input[type=hidden]').val();
        return '<input type="checkbox" name="checkEC" id="estiloCheckbox"/>';
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
       return '<button tyoe ="button" class="btn btn-primary btn-elevate btn-pill btn-sm" id="BtnVerXML"><i class="flaticon2-file"></i></button>';
     }
   },
       {
      "width": "3%",
      "className": "dt-head-center dt-body-center",
      "targets": 11,
      "mRender": function (data, type, full) {
       return '<button tyoe ="button" class="btn btn-danger btn-elevate btn-pill btn-sm" id="BtnEliminarFactura"><i class="flaticon-delete"></i></button>';
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


        //eliminar row de la tabla estados de cuenta
    $('#TableEstadosdeCuenta').on( 'click', '#BtnEliminarFactura', function () {
         Swal.fire({
            title: '¿Estas Seguro?',
            text: "Estas a un click de eliminar algo importante",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    table.row($(this).parents('tr')).remove().draw();
                    Swal.fire(
                        'Eliminado!',
                        'Eliminado con exito',
                        'success'
                    )
                }
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
$('#BtnSubirCobros').on('click', function(){
 showDatosObtenidos();
});


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
      "width": "10%",
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