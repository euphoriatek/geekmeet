import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {SelectModule} from 'ng2-select/ng2-select';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { SebmGoogleMap } from 'angular2-google-maps/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';

declare var jQuery: any;
declare const google: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-venueadd',
  templateUrl: '../../view/eventadd/venueadd.component.html',
  styleUrls: ['../../assets/css/eventadd/eventadd.component.css'],
   encapsulation: ViewEncapsulation.None,  
})
export class VenueaddComponent implements OnInit {
  
   @ViewChild('myMap') mymap: SebmGoogleMap

  value:any;
  countryList:any;
  countryArr:Array<Object> = [];
  stateList:Array<Object> = [];
  cityList:Array<Object> = [];
 
  country: string;
  state: string;
  city: string;
  location: string;  
  venue_image:Array<string> = [];

  title:any;
  description:any;   
  venueErrors:Object = {};
  
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
    
  public file_srcs: string[] = [];  

  constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig, private changeDetectorRef: ChangeDetectorRef) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {    
    this.getCountryList();    
  }
  
 
  getCountryList(){
    var ref = this;
    ref.apiService.countryList(function(res){

      //jQuery('#stateList .ui-select-match-text').html('');
      //ref.state = null;
      
      var countryData = [];
     
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.id.toString();    
      var  item = {id:valueid, text:value.name};       
      countryData.push(item);   
      });

     ref.countryArr = jQuery.makeArray( countryData );
      
    }, function(err){
      console.log(err);
    });
  }
  
  public getState(value:any):void {    
    var ref = this;
    ref.country = value.id;
    ref.apiService.stateList(value.id,function(res){
    
      var stateData = [];
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.state_id.toString();    
      var  item = {id:valueid, text:value.name};       
      stateData.push(item);   
      });

     ref.stateList = jQuery.makeArray( stateData );

    }, function(err){
      console.log(err);
    });
  }

   public getCIty(value:any):void {   
    var ref = this;
    ref.state = value.id;
    ref.apiService.cityList(value.id,function(res){
     
      var cityData = [];
      jQuery.each( res.data , function( key, value ) {   
      var valueid =  value.city_id.toString();    
      var  item = {id:valueid, text:value.name};       
      cityData.push(item);   
      });

     ref.cityList = jQuery.makeArray( cityData );
     console.log(ref.cityList);

    }, function(err){
      console.log(err);
    });
  }

   public optionSelected(value:any,type:any):void {        
       if(type=='city')
       {
          this.city = value.id;
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
    console.log(ref.venue_image);
    jQuery( "#venue_submit" ).prop("disabled",true);
    jQuery( "#venue_cancel" ).prop("disabled",true);
    
    value.images = ref.file_srcs;

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
        this.modal.close();
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
        ref.venueErrors = error;
        jQuery( "#venue_submit" ).prop("disabled",false);
        jQuery( "#venue_cancel" ).prop("disabled",false);        
      });
  }


 fileChange(input){
    this.readFiles(input.files);
  }

  readFile(file, reader, callback){
    // Set a callback funtion to fire after the file is fully loaded
    reader.onload = () => {
      // callback with the results
      callback(reader.result);
    }

    // Read the file
    reader.readAsDataURL(file);
  }

  readFiles(files, index=0){
    // Create the file reader
    let reader = new FileReader();

    // If there is a file
    if (index in files){
      // Start reading this file
      this.readFile(files[index], reader, (result) =>{
        // After the callback fires do:
        this.file_srcs.push(result);
        this.readFiles(files, index+1);// Read the next file;
      });
    }else{
      // When all files are done This forces a change detection
      this.changeDetectorRef.detectChanges();
    }
  }

  removeLocationData(){
    var ref = this;
    ref.file_srcs = [];  
    jQuery( 'input[type="file"]' ).val("");
    ref.getCountryList(); 
    
    jQuery('.map_div').hide();
    jQuery( "#venue_submit" ).prop("disabled",false);
    jQuery( "#venue_cancel" ).prop("disabled",false);
    //ref.router.navigate(['/eventadd']);   
    //this.venueErrors = {};
  }  
 
}
