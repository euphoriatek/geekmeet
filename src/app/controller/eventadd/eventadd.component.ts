import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {DropdownModule} from "ng2-dropdown";
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';

declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-eventadd',
  templateUrl: '../../view/eventadd/eventadd.component.html',
  styleUrls: ['../../assets/css/eventadd/eventadd.component.css']  
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
  private startDateNormal:string = '';
  private startTextNormal: string = '';

  private endDateNormal:string = '';
  private endTextNormal: string = '';

  private border: string = 'none';
  private myDatePickerNormalOptions = { selectionTxtFontSize: '14px'};

  public audienceList:Array<string> = ['Child', 'Youngest', 'Oldest'];

  constructor(private router: Router,public apiService:ApiMethodService) { }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    //this.userInformation();
    this.getCountryList();  
    this.getVenueList();
    this.getOrganizationList();
    this.getCategoryList();
  }

  ngAfterViewInit() {
   /* jQuery(document).find("#multiple").select2({
      width: '100%',
      start: function (select2) {
        jQuery('.edit_profile__module').removeClass('loading');
      }
    });*/

    jQuery('#eventstart-time, #eventend-time').timepicker({
        showSeconds: true
    });

  }

  /*userInformation(){
    var ref = this;
    ref.apiService.userProfile(function(res){
      ref.getState(res.data.country);
      ref.getCIty(res.data.state);
      ref.userInfoArr = res.data;
      console.log(ref.userInfoArr);
      ref.selectedDateNormal = res.data.dob;
    }, function(err){
      // console.log("this is token expire");
      // console.log(err.status);
      if(err.status == '401'){
        localStorage.removeItem('auth_token');
        this.router.navigate(['/']);
      }
    });
  }*/

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
      //ref.organizationList = res.data;

    }, function(err){
      console.log(err);      
    });    
  }

  getVenueList(){
    var ref = this;
    ref.apiService.venueNames(function(res){
      //ref.venueList = res.data;
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
      //ref.countryList = res.data;

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

  /*getState(id){
    var ref = this;
    ref.apiService.stateList(id,function(res){
      ref.stateList = res.data;
    }, function(err){
      console.log(err);
    });
  }*/

  /*getCIty(id){
    var ref = this;
    ref.apiService.cityList(id,function(res){
      ref.cityList = res.data;
    }, function(err){
      console.log(err);
    });
  }*/

  public getState(value:any):void {
    var ref = this;
    ref.apiService.stateList(value.id,function(res){
      //ref.stateList = res.data;

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
    ref.apiService.cityList(value.id,function(res){
      //ref.stateList = res.data;

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

  submitEvent(value:any):void{
    console.log("this is update of user profile");
    console.log(value);
    /*this.apiService.updateUser(value,function(res){
      console.log(res);
    },function(err){
      console.log(err);
    });*/
  }

 
}
