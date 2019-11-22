$(document).ready(function(){

  $("#TableReporteCobros").DataTable({
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    "responsive": true,
    "paging": true,
    "dom": 'Bfrtip',
    "buttons": [
    'excel'
    ],
    columnDefs: [
      {
          "targets": [0,4],
          "width": "10px",
          "className": "dt-head-center dt-body-center"
      },

      {
        "targets": [1,2],
        "width": "15px",
        "className": "dt-head-center dt-body-center"
      },

      {
        "targets": [3,4],
        "width": "12px",
        "className": "dt-head-center dt-body-right"
      },
    ]
  });


  //rago fecha para el Filtro
  $('input[name="FiltroFechaReporteCobros"]').daterangepicker({
   autoUpdateInput: false
  });

  $('input[name="FiltroFechaReporteCobros"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });

});
