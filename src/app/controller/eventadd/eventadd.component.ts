/*require('jquery');
require('mydatepicker');
console.log(jQuery);*/
import { Component, OnInit, ViewEncapsulation, ViewChild  } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { SebmGoogleMap } from 'angular2-google-maps/core';
import {CKEditorModule} from 'ng2-ckeditor';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';


declare var jQuery: any;
declare const google: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-eventadd',
  templateUrl: '../../view/eventadd/eventadd.component.html',
  styleUrls: ['../../assets/css/eventadd/eventadd.component.css','../../assets/css/eventadd/fileinput.min.css'],
   encapsulation: ViewEncapsulation.None,  
})
export class EventaddComponent implements OnInit {
  
   @ViewChild('myMap') mymap: SebmGoogleMap

  getToken:any;
  userInfoArr:Object = {};
  topic:any;
  value:any;
  countryList:any;
  countryArr:Array<Object> = [];
  stateList:Array<Object> = [];
  cityList:Array<Object> = [];
  categoryList:any;
  organizationList:Array<Object> = [];
  venueList:Array<Object> = [];
  keywordList:Array<string> = [];
  country: string;
  state: string;
  city: string;
  location: string;
  organizers:string;
  keyword:string;
  audience:string;
  start_time:string;
  end_time:string;
  imageArr:Array<string> = []; 
  venue_image:Array<string> = []; 

  title:any;
  description:any;
  startDate:any;
  start_timeErr:any;
  endDate:any;
  end_timeErr:any;
  websiteErr:any;
  countryErr:any;
  stateErr:any;
  cityErr:any;
  organizationErr:any;
  locationErr:any;
  contact:any;
  
  geocoder:any;
  venueErrors:Object = {};  
  center:Object = {
    latitude:51.678418,
    longitude:7.809007
  };  
  venueArr:Object = {};
   
  locationFinder:any;
  getLocation = true;
  resizeOptions: Object = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };
  
  private startDateNormal:string = '';
  private startTextNormal: string = '';

  private endDateNormal:string = '';
  private endTextNormal: string = '';

  private border: string = 'none';
  private myDatePickerNormalOptions = { selectionTxtFontSize: '14px'};

  public audienceList:Array<string> = ['Child', 'Youngest', 'Oldest']; 
  // public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

   constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
   
     // adding script for phone mask
     var s = document.createElement("script");
     s.type = "text/javascript";
     s.src = "../../app/assets/js/jquery/maskedinput.min.js"; 
     var s1 = document.createElement("script");
     s1.type = "text/javascript";
     s1.src = "../../app/assets/js/jquery/fileinput.min.js";

     jQuery("head").append(s);
     jQuery("head").append(s1);

    this.getCountryList();  
    this.getVenueList();
    this.getOrganizationList();
    this.getCategoryList();
  }

  
  ngAfterViewInit() {
  
    jQuery('#eventstart-time, #eventend-time').timepicker({
        showSeconds: true
    });

    jQuery('#eventstart-time').on('change', function(){           
        var startTime = jQuery(this).val();            
        jQuery("#start-Time").val(startTime);       
    });

    jQuery('#eventend-time').on('change', function(){               
        var endTime = jQuery(this).val();            
        jQuery("#end-Time").val(endTime); 
    });

    jQuery("#contactinfo").mask("(999) 999-9999");

    
     // Upload Image       
    jQuery("#attach_ids").val('');
    var base_url = jQuery("#base_url").val();
    jQuery("#eventImages").fileinput({
            uploadUrl: "http://2016.geekmeet.com/admin/v1/upload_images",
            uploadAsync: true,
            overwriteInitial: false,
            showUpload: false,
            showRemove: false,
            resizeImage: true,
            allowedFileExtensions:['gif', 'png','jpg','jpeg']                              
    });

    var ref = this;
    var $image = jQuery('#eventImages');
        $image.on('fileuploaded', function (event, data, previewId, index) {
        console.log('uploaded');
        var form = data.form, files = data.files, extra = data.extra,
        response = data.response, reader = data.reader;
        var ids = jQuery("#attach_ids").val();
        console.log(ids);
        ref.imageArr = [];
        if (ids != '')
        { ref.imageArr.push(ids); }

        ref.imageArr.push(response);

        jQuery("#attach_ids").val(ref.imageArr);
        jQuery("#pre_ids").val(ref.imageArr);
        jQuery("#" + previewId).attr("response_id", response);
        }).on("filebatchselected", function (event, files) {
        $image.fileinput("upload");
        });
                 
        // delete Image

        jQuery(document).on("click", ".kv-file-remove", function ()   {
        jQuery(this).attr("disabled", "disabled");
            var del_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
            ref.delete_image(del_id);
        });

        jQuery(document).on("click", ".file-upload-indicator", function ()   {
            if (jQuery(this).hasClass('yellow')){
            var status = 0;
            } else{
              var status = 1;
            }

            var featured_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
            var res = ref.featured_image(featured_id, status);
            if (res){
            jQuery(this).addClass('yellow');
            } else{
            jQuery(this).removeClass('yellow')
            }
        });

       // delete Image on load

      var pre_ids = jQuery("#pre_ids").val();
      if (pre_ids != '') {
          ref.delete_image(pre_ids);
      }

    jQuery('body').find("#cancel").click(function () {
    var url = jQuery(this).attr('data-href');
    var pre_ids = jQuery("#pre_ids").val();
    if (pre_ids != '') {
    jQuery.ajax({
    type: 'POST',
      url: "http://2016.geekmeet.com/admin/v1/remove_image",
      data: {id: pre_ids},
      success: function (data) {
      },
      complete:function(){
      window.location.href = '/event';
      }
    });
    } else{
       window.location.href = '/event'; }
    });


    jQuery(document).on('click', '#add_more', function(){
    var obj = jQuery(document).find("#add_more_div").clone();
            console.log(jQuery(document).find("#add_more_div"));
            jQuery(obj).removeAttr('hidden');
            jQuery(obj).removeAttr('id');
            jQuery(obj).appendTo("#images_div");
    });

    jQuery(document).on('click', '#remove_image', function(){
        jQuery(this).parents('.form-group').remove();
    });  




  }

  
  getOrganizationList(){
    var ref = this;
    ref.apiService.organizationNames(function(res){  
      if(res.message == 'token_expired'){
        localStorage.removeItem('auth_token');
        this.router.navigate(['/']);
      } 

      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.organization_id.toString();    
      var  item = {id:valueid, text:value.organization_name};       
      ref.organizationList.push(item);   
      });

     ref.organizationList = jQuery.makeArray( ref.organizationList );
      
    }, function(err){
      console.log(err);      
    });    
  }

  getVenueList(){
    var ref = this;
    ref.apiService.venueNames(function(res){      
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.venue_id.toString();    
      var  item = {id:valueid, text:value.venue_name};       
      ref.venueList.push(item);   
      });

     ref.venueList = jQuery.makeArray( ref.venueList );
    }, function(err){
      console.log(err);
    });    
  } 

  getCategoryList(){
    var ref = this;
    ref.apiService.categoryList(function(res){
      ref.keywordList = res.data;
      var arr = jQuery.makeArray( res.data );

      for (var i = 0; i < arr.length; i++) {    
        ref.keywordList.push(arr[i].category_name);
       }

    }, function(err){
      console.log(err);
    });    
  } 

  getCountryList(){
    var ref = this;
    ref.apiService.countryList(function(res){
      
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.id.toString();    
      var  item = {id:valueid, text:value.name};       
      ref.countryArr.push(item);   
      });

     ref.countryArr = jQuery.makeArray( ref.countryArr );
      
    }, function(err){
      console.log(err);
    });
  }
  
  public getState(value:any):void {    
    var ref = this;
    ref.country = value.id;
    ref.apiService.stateList(value.id,function(res){
    
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.state_id.toString();    
      var  item = {id:valueid, text:value.name};       
      ref.stateList.push(item);   
      });

     ref.stateList = jQuery.makeArray( ref.stateList );

    }, function(err){
      console.log(err);
    });
  }

   public getCIty(value:any):void {   
    var ref = this;
    ref.state = value.id;
    ref.apiService.cityList(value.id,function(res){
     
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.city_id.toString();    
      var  item = {id:valueid, text:value.name};       
      ref.cityList.push(item);   
      });

     ref.cityList = jQuery.makeArray( ref.cityList );
     console.log(ref.cityList);

    }, function(err){
      console.log(err);
    });
  }

  uploadImages(value:any){
    console.log('here');
    console.log(value);
  }

  public optionSelected(value:any,type:any):void { 
       
    switch (type) {
      case "city":
       this.city = value.id;
        break;    
      case "organization":
       this.organizers = value.id;
        break;   
      case "location":
       this.location = value.id;
        break;    
      case "audience":
      {
        var listdata = '';
        jQuery.each( value, function( key, data ) {          
        listdata =listdata+","+data.id;
        });
        listdata = listdata.replace(/(^,)|(,$)/g, "");
        this.audience = listdata;
      }      
      break;   
      case "keyword":
      {
        var listdata = '';
        jQuery.each( value, function( key, data ) {          
        listdata =listdata+","+data.id;
        });
        listdata = listdata.replace(/(^,)|(,$)/g, "");
        this.keyword = listdata;
      }
      break;    
    }

  }


  onDateChanged(event:any, type) {
    console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    if(event.formatted !== '') {
      if(type=='start')
      {
        this.startTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
        this.startDateNormal = event.formatted;
      }  
      else
      {
        this.endTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
        this.endDateNormal = event.formatted;
      }    
      this.border = '1px solid #CCC';
    }
    else {
      if(type=='start')
      {this.startTextNormal = '';}
      else
      {this.endTextNormal = '';} 
      this.border = 'none';
    }
  }

  timechange(event:any) {
    console.log(event);
  }

  submitEvent(value:any):void{
    var ref = this;
    console.log("submit add event");    
    console.log(value);   
    var start_time = jQuery("#start-Time").val();
    var end_time = jQuery("#end-Time").val();
    var upload_images = jQuery("#attach_ids").val();
    value.start_time  = start_time;
    value.end_time  = end_time;
    value.image_id = upload_images;     
    ref.loadingSvc.setValue(true);

     ref.apiService.addEvent(value,function(res){
       ref.loadingSvc.setValue(false);
        var toastOptions:ToastOptions = {
          title: "Event Added!",
          msg: res.message,
          showClose: true,
          timeout: 1000,
          theme: 'bootstrap',
          onAdd: (toast:ToastData) => {

          },
          onRemove: function(toast:ToastData) {
            ref.router.navigate(['/eventadd']);
          }
        };
        ref.toastyService.success(toastOptions);
        ref.router.navigate(['/event']);
      },function(error){
        ref.loadingSvc.setValue(false);
        if(error.status == 401 || error.status == '401' || error.status == 400){
          localStorage.removeItem('auth_token');        
          ref.apiService.signinSuccess$.emit(false);
          ref.router.navigate(['/index']);
        }
        ref.toastyService.error(error.json().message);
        var errors = error.json().errors;
        ref.title = errors.event_title;
        ref.description = errors.event_description;
        ref.startDate = errors.start_date;
        ref.start_timeErr = errors.start_time;
        ref.endDate = errors.end_date;
        ref.end_timeErr = errors.end_time;
        ref.websiteErr = errors.website;
        ref.countryErr = errors.country;
        ref.stateErr = errors.state;
        ref.cityErr = errors.city;
        ref.organizationErr = errors.organizers;
        ref.locationErr = errors.location;
        ref.contact = errors.contact_info;  
      });
  }

  delete_image(ids){
      var ref = this;
      jQuery.ajax({
        type: 'POST',
        url: "http://2016.geekmeet.com/admin/v1/remove_image",
        data: {id: ids},
        success: function (data) {
          var res = jQuery.parseJSON(data)
          if (res.status == 1) {
            var attchstr = jQuery('body').find("#attach_ids").val();
            var new_string = ref.remove(attchstr, ids);
            ref.imageArr = []; ref.imageArr.push(new_string);
            jQuery('body').find("#attach_ids").val('');
            jQuery('body').find("#attach_ids").val(ref.imageArr);
          }
        }
      });
      return 1;
    }

    featured_image(ids, status){

      jQuery.ajax({
        type: 'POST',
        url: "http://2016.geekmeet.com/admin/v1/set_featured_image",
        data: {id: ids, status:status},
        success: function (data) {
          var res = jQuery.parseJSON(data)
          if (res.status == 1) {
          return 1;
          } else{
          return 0;
          }
        }
      });
      return status;
    }

    remove(string, to_remove)
    {
      if (string != '' && typeof string != 'undefined') {
      var elements = string.split(",");
      var remove_index = elements.indexOf(to_remove);
      elements.splice(remove_index, 1); var result = elements.join(",");
      return result;
      }
    }

   getLatLong(val:any):void{
   
    var ref = this;
    
    if(val.address == undefined){
      ref.toastyService.error("Please provide address");
    }
    else{ 
        var country = jQuery("#countryList .ui-select-match-text").text();
        var state = jQuery("#stateList .ui-select-match-text").text();
        var city = jQuery("#cityList .ui-select-match-text").text();
        var address = val.address;
        
        var apiAddress = val.address+','+city+','+state+','+country;
        console.log(apiAddress);
        ref.geocoder = new google.maps.Geocoder();
        ref.geocoder.geocode( { 'address': apiAddress}, function(results, status) {
          console.log(status);
          if (status == 'OK') { 
            ref.locationFinder='';
            ref.venueArr['latitude'] = results[0].geometry.location.lat();
            ref.venueArr['longitude'] = results[0].geometry.location.lng();                 
            ref.mymap.triggerResize();      
            jQuery(".map_div").show();
          }
          else{
            ref.locationFinder = "Can Not Find Location.!";
          }
        });
     }  
   }
   
   submitLocation(value:any):void{
    var ref = this;
    
    jQuery( "#images_div input[type=file]" ).each(function() {
      var image = jQuery(this).val();
      if(image != '')
        {ref.venue_image.push();}       
    });
    
    value.venue_image = ref.venue_image;

     ref.apiService.addVenue(value,function(res){
       ref.loadingSvc.setValue(false);
        var toastOptions:ToastOptions = {
          title: "Location Added!",
          msg: res.message,
          showClose: true,
          timeout: 1000,
          theme: 'bootstrap',
          onAdd: (toast:ToastData) => {

          },
          onRemove: function(toast:ToastData) {
            ref.router.navigate(['/eventadd']);
          }
        };
        ref.toastyService.success(toastOptions);
        ref.router.navigate(['/eventadd']);
      },function(error){
        ref.loadingSvc.setValue(false);
        if(error.status == 401 || error.status == '401' || error.status == 400){
          localStorage.removeItem('auth_token');        
          ref.apiService.signinSuccess$.emit(false);
          ref.router.navigate(['/index']);
        }
        ref.toastyService.error(error.json().message);
        var error = error.json().errors;
        //ref.venueErrors = error;        
      });
  }
 
 
}
