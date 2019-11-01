$(document).ready(function() {
var cliente;
var moneda;
    var bandera = $('#isEvicencias').val();
    console.log(bandera);
//Tabla Pendientes de enviar
   var table =  $('#TablePendientesEnviar').DataTable( {
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
            return (bandera != 'false' ? '<input type="checkbox" name="checkPE" />': '');
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
            "width": "5%",
            "className": "dt-head-center dt-body-center",
            "targets": 10,
             "mRender": function (data, type, full) {
               return (bandera != 'false' ? '<a class="kt-badge kt-badge--warning kt-badge--inline" data-toggle="modal" data-target="#ModalVerEvidencias" data-backdrop="static" data-keyboard="false"><i class="flaticon2-image-file"></i></a>':'');
               }
         }]
    } );

//on click select row checkbox

        //var table = $('#TablePendientesEnviar').DataTable();
         $('#TablePendientesEnviar').on( 'change', 'input[name="checkPE"]', function () {
             FiltroCheckboxCliente();
             if($(this).is(':checked'))
             {
                 adddatos();
                 ContadorCheck();
             }
            else
             {
                 var a = adddatos();
                 ContadorCheck();

             }

                } );


//on click para el boton del modal subir factura
    $('#BtnSubirFacturaPendietnesEnviar').on('click', function(){
         getDatos();
    });



//ocultar columnas tabla pendientes enviar
        $('input[name="Fecha Descarga"]').on('change', function(e){
           e.preventDefault();
            var column = table.column(3);
            column.visible( ! column.visible() );
        });
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
                $('input[name="Total"]').on('change', function(e){
           e.preventDefault();
            var column = table.column(7);
            column.visible( ! column.visible() );
        });


//Filtro Rango fecha
        $('input[name="FiltroFecha"]').daterangepicker({
	        autoUpdateInput: false
        });

        $('input[name="FiltroFecha"]').on('apply.daterangepicker', function(ev, picker) {
		    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
        });

// Filtro select cliente
        $("#kt_select2_3").select2({
		    placeholder: "Cliente"
        });


//Fechas modal
$('#kt_modal_2').on('shown.bs.modal', function(){
                  $('#FechaFactura').datepicker({
				    	todayHighlight: true
			    	 });
				  $("#FechaFactura").datepicker('setDate', 'today' );
        		 $('#FechaRevision').datepicker({
				    todayHighlight: true,
				    });
				 $("#FechaRevision").datepicker('setDate', 'today' );

				 $('#FechaVencimiento').datepicker({
					 todayHighlight: true
				 });
				 $("#FechaVencimiento").datepicker('setDate', 'today' );
				 $('#FechaVencimiento').prop('disabled', true);
});

//limpiar modal
$('#kt_modal_2').on('hidden.bs.modal', function(){
        LimpiarModalSF();
});






//FUNCIONES PARA EL MENU PENDIENTES DE ENVIAR


// funcion contador para los checkbox seleccionados
function ContadorCheck()
{
    var cont = 0;
         $('input[name="checkPE"').each(function (){
               if($(this).is(':checked'))
                  {
                      cont++;
                   }
              });

              if(cont != 0)
                {
                    $('#BtnSubirFacturaPendietnesEnviar').prop('disabled', false);
                }
                else
                {
                    $('#BtnSubirFacturaPendietnesEnviar').prop('disabled', true);
                }
}


//validacion mismo cliente en los checkbox
function FiltroCheckboxCliente(){
var checked = $("input[name='checkPE']:checked");
$("input[name=checkPE]:checked").each(function () {
 var check = table.row($(this).parents('tr')).data();
    if(checked.length > 1)
    {
       if (check[2] != cliente || check[8] != moneda) {
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

toastr.error("El cliente debe ser el mismo");
            }
            else
            {
                console.log("ok");
            }
    }
    else
    {
            cliente = check[2];
            moneda = check[8];
    }
});
}



//funcion para obtener los datos de cada checkbox seleccionado en la tabla pendientes de enviar
function adddatos(){
    var arrSelect=[];
                 $("input[name=checkPE]:checked").each(function () {
                var datosRow = table.row($(this).parents('tr')).data();
                    arrSelect.push([datosRow[1], datosRow[4], datosRow[5], datosRow[6], datosRow[7]]);
                   });
                   return arrSelect;
}


//funcion para obtener los datos de la tabla pendiente de enviar para mostrarlos en la tabla del modal subir facturas
function getDatos(){
   var datos = adddatos();
   var subtotal = 0, Tiva=0, TRetencion=0, total=0;
   for (var i=0; i<datos.length; i++)
   {
        var sub = parseFloat(datos[i][1]);
        var iva = parseFloat(datos[i][2]);
        var retencion = parseFloat(datos[i][3]);
        var tot = parseFloat(datos[i][4]);
        subtotal = subtotal + sub;
        Tiva = Tiva + iva;
        TRetencion = TRetencion + retencion;
        total = total + tot;
        console.log(subtotal);
   }
   var h = [datos];
                var table = $('#ResumTable').DataTable({
                destroy: true,
                data: h[0]
             });
   $('#sub').html('<strong>$'+subtotal+'</strong>');
   $('#iva').html('<strong>$'+Tiva+'</strong>');
   $('#retencion').html('<strong>$'+TRetencion+'</strong>');
   $('#total').html('<strong>$'+total+'</strong>');

}


//funcion limpiar modal subir facturas de pendientes de enviar
function LimpiarModalSF()
{
    $('input[name="FolioFactura"]').val("");
    $('input[name="Comentarios"]').val("");
    $('input[name="TipoCambio"]').val(0);
}



// plugin para subir los archivos de las facturas en Modal Pendientes de enviar
				 "use strict";

		// Class definition
		var KTUppy = function () {
			const Tus = Uppy.Tus;
			const ProgressBar = Uppy.ProgressBar;
			const StatusBar = Uppy.StatusBar;
			const FileInput = Uppy.FileInput;
			const Informer = Uppy.Informer;
			const XHRUpload = Uppy.XHRUpload;


			// to get uppy companions working, please refer to the official documentation here: https://uppy.io/docs/companion/
			const Dashboard = Uppy.Dashboard;
			const Dropbox = Uppy.Dropbox;
			const GoogleDrive = Uppy.GoogleDrive;
			const Instagram = Uppy.Instagram;
			const Webcam = Uppy.Webcam;

			// Private functions
			var initUppy1 = function(){
				var id = '#kt_uppy_1';

				var options = {
					proudlyDisplayPoweredByUppy: false,
					target: id,
					inline: true,
					height: 260,
					replaceTargetContent: true,
					showProgressDetails: true,
					note: 'Logisti-k',


					metaFields: [
						{ id: 'name', name: 'Name', placeholder: 'file name' },
						{ id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
					],
					browserBackButtonClose: true
				}

				var uppyDashboard = Uppy.Core({
					autoProceed: true,
					restrictions: {
						maxFileSize: 5000000, // 5mb
						maxNumberOfFiles: 2,
						minNumberOfFiles: 1,
					  allowedFileTypes:['.pdf', '.xml']
					},
					locale: Uppy.locales.es_ES
				});


				uppyDashboard.use(Dashboard, options);
				uppyDashboard.use(XHRUpload, { endpoint: 'https://api-bkg-test.logistikgo.com/api/Viaje/SaveevidenciaTest', method: 'post'});
				//uppyDashboard.use(XHRUpload, { endpoint: 'http://localhost:63510/api/Viaje/SaveevidenciaTest', method: 'post'});
				uppyDashboard.use(GoogleDrive, { target: Dashboard, companionUrl: 'https://companion.uppy.io' });
				//uppyDashboard.use(Dropbox, { target: Dashboard, companionUrl: 'https://companion.uppy.io' });
				//uppyDashboard.use(Instagram, { target: Dashboard, companionUrl: 'https://companion.uppy.io' });
				//uppyDashboard.use(Webcam, { target: Dashboard });
                uppyDashboard.on('upload-success', (file, response) => {
                    const url = response.body
                    const fileName = file.name
                    console.log(url);
                    document.querySelector('.uploaded-files ol').innerHTML +=
    `<li><a href="${url}" target="_blank">${fileName}</a></li>`
                  })
    /* uppyDashboard.on('complete', (result) => {
        console.log('Upload complete! We’ve uploaded these files:', result.successful)
      })*/
			}
			return {
				// public functions
				init: function() {
					initUppy1();

				}
			};
		}();

		KTUtil.ready(function() {
			KTUppy.init();
		});

});