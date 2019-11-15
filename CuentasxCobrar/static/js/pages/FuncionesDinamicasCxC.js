// funcion contador para los checkbox seleccionados
function ContadorCheck(input, btnSubir)
{
  var cont = 0;
  $(input).each(function (){
   if($(this).is(':checked'))
   {
    cont++;
  }
});
$(btnSubir).prop('disabled', !cont !=0);
 /* if(cont != 0)
  {

  }
  else
  {
    $(btnSubir).prop('disabled', true);
  }*/
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
			const GoogleDrive = Uppy.GoogleDrive;


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

					/*metaFields: [
						{ id: 'name', name: 'Name', placeholder: 'file name' },
						{ id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
           ],*/
           browserBackButtonClose: true
         }

         var uppyDashboard = Uppy.Core({
           autoProceed: false,
           restrictions: {
						maxFileSize: 5000000, // 5mb
						maxNumberOfFiles: 2,
						minNumberOfFiles: 2,
           allowedFileTypes:['.pdf', '.xml']
         },
         locale: Uppy.locales.es_ES,
         onBeforeFileAdded: (currentFile, file) => {

           console.log(currentFile.type)
           console.log($('.uppy-DashboardContent-title').length)
           if($('.uppy-DashboardContent-title').length == 0)
           {
             console.log("+1")
           }
           else
           {
             if((currentFile.type === Object.values(file)[0].meta.type))
             {
               uppyDashboard.info(`Los archivos deben ser diferentes`, 'error', 500)
               return false
             }
             else
             {
               console.log("ok")
             }
           }
/*
					    if($('.uppy-DashboardContent-title').length == 0)
					    {
					        if(currentFile.type != 'application/pdf' && currentFile.type != 'text/xml')
					        {
					            console.log("solo pdf y xml")
					        }
					        else
					        {

					            TestFile = currentFile.type
					        }

					    }

					    if($('.uppy-DashboardContent-title').length == 2)
					    {
                            console.log(Object.values(file)[0].meta.type)
					        if(TestFile == currentFile.type)
					        {
					            uppyDashboard.info(`Los archivos deben ser diferentes`, 'error', 500)
					            return false
					        }
               }*/

             }
           });


         uppyDashboard.use(Dashboard, options);
         uppyDashboard.use(XHRUpload, { endpoint: 'https://api-bkg-test.logistikgo.com/api/Viaje/SaveevidenciaTest', method: 'post'});
				//uppyDashboard.use(XHRUpload, { endpoint: 'http://localhost:63510/api/Viaje/SaveevidenciaTest', method: 'post'});
				uppyDashboard.use(GoogleDrive, { target: Dashboard, companionUrl: 'https://companion.uppy.io' });
        uppyDashboard.on('upload-success', (file, response) => {
          console.log(file)
          const fileName = file.name
          if (file.extension === 'pdf')
          {
           const urlPDF = response.body
           $('#kt_uppy_1').data("rutaarchivoPDF", urlPDF)
           document.querySelector('.uploaded-files').innerHTML +=
           `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaPDF">${fileName}</a></li></ol>`
                 //  console.log($('#kt_uppy_1').data("rutaarchivoPDF"))
               }
               else
               {
                 const urlPDF = response.body
                 $('#kt_uppy_1').data("rutaarchivoXML", urlPDF)
                 document.querySelector('.uploaded-files').innerHTML +=
                 `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaXML">${fileName}</a></li></ol>`
                   //console.log($('#kt_uppy_1').data("rutaarchivoXML"))
                 }
                 //const url = response.body
   // `<embed src="${url}">`
 });

      }
      return {
				// public functions
				init: function() {
					initUppy1();

				}
			};
		}();




function leerxml(xml)
{
    var rest;
    var req = new XMLHttpRequest();
       req.open('GET', xml, false);
       req.send(null);
       if (req.status == 200)
       {
           var resp = req.responseXML;
           var obNodos = resp.children[0].attributes;
           var total = obNodos.Total;
           (total != undefined) ? rest = total.nodeValue : rest = 0;
       }
       else
       {
           rest = 0;
       }
    return rest;
}

function WaitMe_Show(idForm) {
    $(idForm).waitMe({
        effect: 'ios',
        text: 'Por favor espera...',
        bg: 'rgb(255,255,255)',
        color: '#38227F',
        sizeW: '',
        sizeH: '',
        source: ''
    });
};

function WaitMe_Hide(idForm) {
        $(idForm).waitMe('hide');
};

function alertToastError(msj)
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
    "timeOut": "6000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  toastr.error(msj);
}

function truncarDecimales (x, posiciones = 0) {
  var s = x.toString()
    var l = s.length
    var decimalLength = s.indexOf('.') + 1
    var numStr = s.substr(0, decimalLength + posiciones)
    return Number(numStr)
}
