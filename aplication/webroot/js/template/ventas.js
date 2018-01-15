var $table = $('#bootstrap-table-ventas');

  function operateFormatter(value, row, index) {
      return [
  '<div class="table-icons">',
            '<a rel="tooltip" title="Descargar" class="btn btn-simple btn-info btn-icon table-action view" href="javascript:void(0)">',
            '<i class="ti-image"></i>',
            '</a>',
            '<a rel="tooltip" title="Cancelar" class="btn btn-simple btn-danger btn-icon table-action edit" href="javascript:void(0)">',
                '<i class="ti-close"></i>',
            '</a>',
            // '<a rel="tooltip" title="Eliminar" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
            //     '<i class="ti-close"></i>',
            // '</a>',
  '</div>',
      ].join('');
  }

$("#formAddAgencia").submit(function(e) { //AGREGAR UN PAQUETE
    e.preventDefault();
    var $form = $(this);
    if(! $form.valid()) return false;
    var formData = new FormData($("#formAddAgencia")[0]);
    var ruta = "ajax2.php";
    $.ajax({
        url: ruta,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(datos){
           swal({
              title: 'Registrado!',
              text: datos,
              type: 'success',
              confirmButtonText: 'Ok!',
              allowOutsideClick: false,
              allowEscapeKey: false,
              onClose: function(){
                location.href="agencias.php";
              }
            })

        }
    });
    return false;
});


$("#formEditAgencia").submit(function(e) {
    e.preventDefault();
    var $form = $(this);
    if(! $form.valid()) return false;
    var formData = new FormData($("#formEditAgencia")[0]);
    var ruta = "ajax2.php";
    $.ajax({
        url: ruta,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(datos){
           swal({
              title: 'Listo!',
              text: 'Registro Modificado!',
              type: 'success',
              confirmButtonText: 'Ok!',
              allowOutsideClick: false,
              allowEscapeKey: false,
              onClose: function(){
                location.href="agencias.php";
              }
            })
        }
    });
    return false;
});



  $().ready(function(){
      window.operateEvents = {
          'click .view': function (e, value, row, index) {
            info = JSON.stringify(row);
            var html = '<h4>Selecciona un Tipo de Documento</4>'+
                        '<select class="tipo_documento">'+
                          '<option value ="0">PDF</option>'+
                          '<option value ="1">WORD</option>'+
                        '</select>';
            swal({
              type: 'info',
              html: html,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Descargar',
              cancelButtonText: 'Cancelar',
              confirmButtonClass: 'btn btn-success',
              cancelButtonClass: 'btn btn-danger',
              allowOutsideClick: false,
              allowEscapeKey: false,
              buttonsStyling: false,
              preConfirm: () => {
                var dato = $("select.tipo_documento").val();
                if (dato == 0) {
                  swal('', 'Se descargo el archivo pdf','success');
                }else {
                  swal('', 'Se descargo el archivo word','success');
                }
                $.ajax({
                  url: 'ajax2.php',
                  type: 'POST',
                  data: '&action=getIdCotizacion&id='+row.id,
                  success: function(datos){
                    var id_cotizacion = datos.replace("	","");
                    location.href="pdf_cotizacion.php?id="+id_cotizacion+"&tipo="+dato;

                  }
                });

              }
            })

            $(".tipo_documento").selectpicker();

          },
          'click .edit': function (e, value, row, index) {
              info = JSON.stringify(row);

              var fecha_actual = moment().format("YYYY-MM-DD");

              var dias = moment(row.fecha_reserva).diff(moment(fecha_actual), 'days');

              if (row.id_estado >= 2) {
                if (row.id_estado == 2) {
                  var t = "cancelada";
                }else {
                  var t = "cancelada con penalidad";
                }
                swal('', 'Esta venta se encuentra '+t+'.','info');
                return;
              }if (dias <= 0) {
                return;
              }

              if (dias > 60) {
                var titulo = "Cancelar";
                var titulo_salida = "Cancelada";
                var estado = 2;
              }else {
                var titulo = "Cancelar con penalidad";
                var titulo_salida = "Cancelada con penalidad";
                var estado = 3;
              }

              swal({
                  title: titulo,
                  type: 'info',
                  text: 'Esta acción no se puede deshacer,¿Desea continuar?',
                  showCancelButton: true,
                  confirmButtonText: 'Continuar',
                  showLoaderOnConfirm: false,
                  allowOutsideClick: false
                }).then((result) => {
                  $.ajax({
                    url: 'ajax2.php',
                    type: 'POST',
                    data: '&action=updateEstadoCotizacion&id='+row.id+'&estado='+estado,
                    beforeSend: function(){
                    },
                    success: function(datos){
                      swal({
                        title: 'Felicidades!',
                        text: "Venta "+titulo_salida,
                        type: 'success',
                        confirmButtonText: 'Ok!',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        onClose: function(){
                          location.href="ventas.php";
                        }
                      })
                    }
                  })
                })
          }
      };

      $table.bootstrapTable({
          toolbar: ".toolbar",
          clickToSelect: true,
          search: true,
          showToggle: true,
          pagination: true,
          searchAlign: 'left',
          pageSize: 8,
          clickToSelect: false,
          pageList: [8,10,25,50,100],

          formatShowingRows: function(pageFrom, pageTo, totalRows){
              //do nothing here, we don't want to show the text "showing x of y from..."
          },
          formatRecordsPerPage: function(pageNumber){
              return pageNumber + " Filas Visibles";
          },
          icons: {
              refresh: 'fa fa-refresh',
              toggle: 'fa fa-th-list',
              columns: 'fa fa-columns',
              detailOpen: 'fa fa-plus-circle',
              detailClose: 'ti-close'
          }
      });

      //activate the tooltips after the data table is initialized
      $('[rel="tooltip"]').tooltip();

      $(window).resize(function () {
          $table.bootstrapTable('resetView');
      });
});