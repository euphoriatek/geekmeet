import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-eventadd',
  templateUrl: '../../view/eventadd/eventadd.component.html',
  styleUrls: ['../../assets/css/eventadd/eventadd.component.css','../../assets/css/eventadd/fileinput.min.css'],
   encapsulation: ViewEncapsulation.None,  
})
export class EventaddComponent implements OnInit {
 
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
  
  private startDateNormal:string = '';
  private startTextNormal: string = '';

  private endDateNormal:string = '';
  private endTextNormal: string = '';

  private border: string = 'none';
  private myDatePickerNormalOptions = { selectionTxtFontSize: '14px'};

  public audienceList:Array<string> = ['Child', 'Youngest', 'Oldest']; 
  // public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

   constructor(private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
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
    
    jQuery("#eventImages").fileinput({
                uploadAsync: false,
                        uploadUrl: "./my_ajax/test.php", // your upload server url
                        uploadExtraData: function() {
                        return {                      
                        };
                        }
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
    value.start_time  = start_time;
    value.end_time  = end_time;
     
     ref.apiService.addEvent(value,function(res){
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
 
 
}
