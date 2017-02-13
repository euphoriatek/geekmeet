import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
// import {CKEditorModule} from 'ng2-ckeditor';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';
import { VenueaddComponent } from './venueadd.component';
import { OrganizationAddComponent } from '../organization-add/organization-add.component';
import { Typeahead } from 'ng2-typeahead';
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

  // @ViewChild('myMap') mymap: SebmGoogleMap

  getToken:any;
  userInfoArr:Object = {};
  topic:any;
  value:any;
  
  categoryList:any;
  organizationList:Array<Object> = [];
  venueList:Array<Object> = [];
  keywordList:Array<string> = [];
  
  location: string;
  organizers:string;
  keyword:string;
  audience:string;
  start_time:string;
  end_time:string;
  imageArr:Array<string> = []; 

  title:any;
  description:any;
  startDate:any;
  start_timeErr:any;
  endDate:any;
  end_timeErr:any;
  websiteErr:any;
  visibilityDropDown:any= false;
  organizationErr:any;
  locationErr:any;
  contact:any;  
  organiuzationArr:any;
  geocoder:any;
  errors:Object = {};  
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
  newDate:any = new Date();
  private myDatePickerOptions = {
    dateFormat:'dd-mm-yyyy',
    disableUntil: {year: this.newDate.getFullYear(), month: this.newDate.getMonth()+1, day: this.newDate.getDate()-1}
  };
  myDatePickerEndOptions = {
    dateFormat:'dd-mm-yyyy',
    disableUntil: {year: this.newDate.getFullYear(), month: this.newDate.getMonth()+1, day: this.newDate.getDate()-1}
  };

  public audienceList:Array<string> = ['Child', 'Youngest', 'Oldest']; 
  
  constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig, private changeDetectorRef: ChangeDetectorRef) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }

    this.getVenueList();
    this.getOrganizationList();
    this.getCategoryList();
    var eventAddIndex = this;
    this.apiService.setEventAdd(eventAddIndex);
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


  }



  
  getOrganizationList(){
    var ref = this;
    ref.apiService.organizationNames(function(res){  
      if(res.message == 'For security purposes, you have been automatically logged out.'){
        localStorage.removeItem('auth_token');
        this.router.navigate(['/']);
      } 

      jQuery.each( res.data , function( key, value ) {   
        var valueid =  value.organization_id.toString();    
        var  item = {id:valueid, text:value.organization_name};       
        ref.organizationList.push(item);   
      });

      ref.organizationList = jQuery.makeArray( ref.organizationList );
      ref.organiuzationArr = ref.organizationList;
      
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

  
  uploadImages(value:any){
    console.log(value);
  }

  public orgSelected(value) {
    console.log("this is value og organaization"+JSON.stringify(value));
    if(value.id){
    this.organizers = value.id;
    }else{
      this.organizers='';
      return;
    }
  }

  public venueSelected(value) {
    if(value){
    this.location = value.id;
    }else{
      this.location='';
      return;
    }
  }

  public optionSelected(value:any,type:any):void { 
    switch (type) {      
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
        this.myDatePickerEndOptions = {
          dateFormat:'dd-mm-yyyy',
          disableUntil:{year: event.date.year, month:event.date.month, day: event.date.day-1}
        };
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
    console.log(value); 

    var start_time = jQuery('#eventstart-time').val();
    var end_time = jQuery("#eventend-time").val();
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
      ref.organizationErr = errors.organizers;
      ref.locationErr = errors.location;
      ref.contact = errors.contact_info;  
    });
  }


}
