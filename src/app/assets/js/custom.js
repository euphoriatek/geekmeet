jQuery(window).load(function () {
    jQuery(document).find('.flexslider').flexslider({
        animation: "slide",
        smoothHeight: true, /* for adjusting height for small images */
        animationLoop: false,
        start: function (slider) {
            jQuery('.event_detail_module').removeClass('loading');
        }
    });

    // jQuery("#multiple").select2({
    //     width: '100%'
    // });

    // jQuery(document).find(".invite-user .modal_close").click(function () {
    //     jQuery(".invite-user").attr("style", "");
    //     jQuery(".reveal-modal-bg").css("display", "none");
    //     jQuery(".invite-user").removeClass("open");
    // });

    jQuery(document).on('click',".modal_close",function () {
      
       var parent = jQuery(this).parent('div');
       jQuery(parent).attr("style", "");
       jQuery(".reveal-modal-bg").css("display", "none");
       jQuery(parent).removeClass("open");
       jQuery(parent).remove();
       jQuery(".invite-user").removeClass("open");
       jQuery(".invite-user").attr("style", "");
   });

    jQuery(document).on('click',".terms",function(){
        jQuery(".reveal-modal-bg").css("display", "none");
    })

    jQuery(document).on('click',".modal_close",function () {
      
       var parent = jQuery("#tmpl_reg_login_container");
       jQuery(parent).attr("style", "");
       jQuery(".reveal-modal-bg").remove();
       parent.remove();

   });
});

jQuery(document).ready(function () {

    // jQuery('#start-date').datepicker({
    //     format: 'mm-dd-yyyy'
    // });
    // jQuery('#end-date').datepicker({
    //     format: 'mm-dd-yyyy'
    // });
    // jQuery('#event-time').timepicker({
    //     showSeconds: true
    // });
    // jQuery('#birth-date').datepicker({
    //    format: 'mm-dd-yyyy'
    // });
    // jQuery("[class='make-switch']").bootstrapSwitch();

    // var todayDate = moment().startOf('day');
    // var YM = todayDate.format('YYYY-MM');
    // var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
    // var TODAY = todayDate.format('YYYY-MM-DD');
    // var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

    // jQuery('#calendar').fullCalendar({
    //     header: {
    //         left: 'prev,next today',
    //         center: 'title',
    //         right: 'month,agendaWeek,agendaDay,listWeek'
    //     },
    //     editable: true,
    //     eventLimit: true, // allow "more" link when too many events
    //     navLinks: true,
    //     events: [
    //         {
    //             title: 'All Day Event',
    //             start: YM + '-01'
    //         },
    //         {
    //             title: 'Long Event',
    //             start: YM + '-07',
    //             end: YM + '-10'
    //         },
    //         {
    //             id: 999,
    //             title: 'Repeating Event',
    //             start: YM + '-09T16:00:00'
    //         },
    //         {
    //             id: 999,
    //             title: 'Repeating Event',
    //             start: YM + '-16T16:00:00'
    //         },
    //         {
    //             title: 'Conference',
    //             start: YESTERDAY,
    //             end: TOMORROW
    //         },
    //         {
    //             title: 'Meeting',
    //             start: TODAY + 'T10:30:00',
    //             end: TODAY + 'T12:30:00'
    //         },
    //         {
    //             title: 'Lunch',
    //             start: TODAY + 'T12:00:00'
    //         },
    //         {
    //             title: 'Meeting',
    //             start: TODAY + 'T14:30:00'
    //         },
    //         {
    //             title: 'Happy Hour',
    //             start: TODAY + 'T17:30:00'
    //         },
    //         {
    //             title: 'Dinner',
    //             start: TODAY + 'T20:00:00'
    //         },
    //         {
    //             title: 'Birthday Party',
    //             start: TOMORROW + 'T07:00:00'
    //         },
    //         {
    //             title: 'Click for Google',
    //             url: 'http://google.com/',
    //             start: YM + '-28'
    //         }
    //     ]
    // });
});


jQuery(window).load(function () {
    /* Code start for map reload and center it on category page after tabs changing */
    jQuery(function () {
        jQuery(document).on('click', "ul.view_mode li #locations_map", function () {
            google.maps.event.trigger(map, 'resize');
            map.fitBounds(bounds);
            var center = bounds.getCenter();
            map.setCenter(center);
        });
    });
    /* Code end */

    if (jQuery('#locations_map').hasClass('active'))
    {
        jQuery('.tev_sorting_option').css('display', 'none');
        jQuery('#directory_sort_order_alphabetical').css('display', 'none');
    } else
    {
        jQuery('.tev_sorting_option').css('display', '');
        jQuery('#directory_sort_order_alphabetical').css('display', '');
    }
    jQuery('.viewsbox a.listview').click(function (e) {
        jQuery('.tev_sorting_option').css('display', '');
        jQuery('#directory_sort_order_alphabetical').css('display', '');
    });
    jQuery('.viewsbox a.gridview').click(function (e) {
        jQuery('.tev_sorting_option').css('display', '');
        jQuery('#directory_sort_order_alphabetical').css('display', '');
    });
    jQuery('.viewsbox a#locations_map').click(function (e) {
        jQuery('.tev_sorting_option').css('display', 'none');
        jQuery('#directory_sort_order_alphabetical').css('display', 'none');
    });
});

function invite_form() {
    jQuery(".invite-user #invite-popup").show();
}


   

    //        Image Plugin;

    var arr = new Array();
    
    // delete Image

    jQuery(document).on("click", ".kv-file-remove", function ()   {
        jQuery(this).attr("disabled", "disabled");
        var delete_id = jQuery(this).attr('data-key');
                if (typeof delete_id != 'undefined') {
                    var del_id = delete_id;
                }
                else
                {
                    var del_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
                }
        //var del_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
        delete_image(del_id);
    });
               
    // delete Image on load
    /*var pre_ids = jQuery("#pre_ids").val();
    if (pre_ids != '') {
        delete_image(pre_ids);
    }*/

    jQuery(document).on("click", ".file-upload-indicator", function ()   {
          console.log('featured click');
            if (jQuery(this).hasClass('yellow')){
            var status = 0;
            } else{
              var status = 1;
            }

             var featured = jQuery(this).attr('data-key');
                if (typeof featured != 'undefined') {
                    var featured_id = featured;
                }
                else
                {
                   var featured_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
                }
            
            var res = featured_image(featured_id, status);
            if (res){
            jQuery(this).addClass('yellow');
            } else{
            jQuery(this).removeClass('yellow')
            }
    });

function featured_image(ids, status){

      jQuery.ajax({
        type: 'POST',
        url: "http://2016.geekmeet.com/admin/v1/set_featured_image",
        data: {id: ids, status:status},
        success: function (data) {
          var res = jQuery.parseJSON(data);
          if (res.status == 1) {
          return 1;
          } else{
          return 0;
          }
        }
      });
      return status;
    }

    function delete_image(ids){      
      jQuery.ajax({
        type: 'POST',
        url: "http://2016.geekmeet.com/admin/v1/remove_image",
        data: {id: ids},
        success: function (data) {
          var res = jQuery.parseJSON(data);
          if (res.status == 1) {
            var attchstr = jQuery('body').find("#attach_ids").val();
            var new_string = remove(attchstr, ids);
            arr = []; arr.push(new_string);
            jQuery('body').find("#attach_ids").val('');
            jQuery('body').find("#attach_ids").val(arr);
          }
        }
      });
      return 1;
    }

    

    function remove(string, to_remove)
    {
      if (string != '' && typeof string != 'undefined') {
      var elements = string.split(",");
      var remove_index = elements.indexOf(to_remove);
      elements.splice(remove_index, 1); var result = elements.join(",");
      return result;
      }
    }


 
