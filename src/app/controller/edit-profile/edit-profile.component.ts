import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {DropdownModule} from "ng2-dropdown";
// import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { SimpleNotificationsModule, NotificationsService }from 'angular2-notifications'
import {CKEditorModule} from 'ng2-ckeditor';
// import * as moment from 'moment';
// import { DatePickerIonicComponent } from 'ng2-datepicker';
// import { Select2Component } from 'ng2-select2/ng2-select';
// import {Select2OptionData} from 'ng2-select2/ng2-select2';
// import  Select2Component  from 'angular2-select2';
declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-edit-profile',
  templateUrl: '../../view/edit-profile/edit-profile.component.html',
  styleUrls: ['../../assets/css/edit-profile/edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  src: string = "";
  getToken:any;
  userInfoArr:Object = {};
  topic:any;
  private value:any = [];
  private topicData:any = [];
  countryList:any;
  stateList:any;
  cityList:any;
  firstname:any;
  lastname:any;
  address:any;
  dob:any;
  birthplace:any;
  gendererr:any;
  country:any;
  state:any;
  city:any;
  zipcode:any;
  email:any;
  contact:any;
  valArr:any;
  newTopic:any;
  public topicArr:Array<string> = ['Cisco','Database',"Microsoft's",'Networking','Open Source','IT', 'Job'];
  private selectedDateNormal:string = '';

  private selectedTextNormal: string = '';
  private border: string = 'none';
  private myDatePickerNormalOptions = { selectionTxtFontSize: '12px'};
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };

  constructor(private router: Router,public apiService:ApiMethodService, private _service: NotificationsService,) { }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    this.userInformation();
    this.getCountryList(); 
    // this.intrestedTopic(); 
  }

  selected(imageResult: ImageResult) {
    this.src = imageResult.dataURL;
  }

  ngAfterViewInit() {
    jQuery(document).find("#multiple").select2({
      width: '100%',
      start: function (select2) {
        jQuery('.edit_profile__module').removeClass('loading');
      }
    });

  }



  userInformation(){
    var ref = this;
    ref.apiService.userProfile(function(res){
      ref.getState(res.data.country);
      ref.getCIty(res.data.state);
      ref.userInfoArr = res.data;

      ref.value = ref.userInfoArr['favorite_category'];

      console.log(ref.userInfoArr);
      ref.selectedDateNormal = res.data.dob;
    }, function(err){
      if(err.status == '401'){
        localStorage.removeItem('auth_token');
        this.router.navigate(['/']);
        ref.apiService.signinSuccess$.emit(false);
      }
    });
  }

  getCountryList(){
    var ref = this;
    ref.apiService.countryList(function(res){
      ref.countryList = res.data;
    }, function(err){
      console.log(err);
    });
  }

  getState(id){
    var ref = this;
    ref.apiService.stateList(id,function(res){
      ref.stateList = res.data;
    }, function(err){
      console.log(err);
    });
  }

  getCIty(id){
    var ref = this;
    ref.apiService.cityList(id,function(res){
      ref.cityList = res.data;
    }, function(err){
      console.log(err);
    });
  }

  // intrestedTopic(){
  //     var ref = this;
  //     ref.apiService.SecondMenuApi(function(res){
  //         ref.newTopic = res.data;
  //         console.log(ref.newTopic);
  //         var newOne = ref.newintrestedTopic(ref.topicData);
  //         console.log(newOne);
  //       });
  //     }

  //      newintrestedTopic(topicData:Array<any> = []):Array<string>{
  //     return topicData
  //     .map((newTopic:any) => {
  //         return newTopic.category_name;
  //       });
  //     }



      public refreshValue(value:any):void {
        this.value = this.convertToValueArray(value);
      }



      public convertToValueArray(value:Array<any> = []):Array<string> {
        return value
        .map((item:any) => {
          return item.text;
        });
      }



      onDateChanged(event:any) {
        console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
        if(event.formatted !== '') {
          this.selectedTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
          this.border = '1px solid #CCC';

          this.selectedDateNormal = event.formatted;
        }
        else {
          this.selectedTextNormal = '';
          this.border = 'none';
        }
      }

      public options = {
        position: ["top", "center"],
        timeOut: 5000,
        lastOnBottom: true
      }

      created(title: 'update successfully.!', type:'success'){}


      updateUserProfile(value:any):void{
        var ref = this;
        value['favorite_category']=this.value.join(',');
        value['image'] = ref.src;
        console.log(value);
        console.log("this is update of user profile");
        console.log(value);
        ref.apiService.updateUser(value,function(res){
          ref.router.navigate(['/profile']);
        },function(err){
          if(err.status == '401' || err.status == 401){
            localStorage.removeItem('auth_token');
            ref.getToken='';
            ref.router.navigate(['/']);
            ref.apiService.signinSuccess$.emit(false);
          }
          var errors = err.json().errors;
          ref.firstname = errors.first_name;
          ref.lastname = errors.last_name;
          ref.address = errors.address;
          ref.dob = errors.dob;
          ref.birthplace = errors.birth_place;
          ref.gendererr = errors.gender;
          ref.country = errors.country;
          ref.state = errors.state;
          ref.city = errors.city;
          ref.zipcode = errors.zip_code;
          ref.email = errors.email;
          ref.contact = errors.phone;  
        });
      }



    }
