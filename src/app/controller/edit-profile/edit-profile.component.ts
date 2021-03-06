import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
// import {CKEditorModule} from 'ng2-ckeditor';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';


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
  keywordList:Array<string> = [];  
  userInfoArr:Object = {};
  errors:Object = {};
  private favValue:any = [];
  private topicData:any = [];
  countryList:any;
  stateListArr:any;
  cityList:any;
  valArr:any;
  newTopic:any;
  cityFIrst = false;
  countryFirst = false;
  private selectedDateNormal:string = '';
  // private myDatePickerOptions = { dateFormat:'dd/mm/yyyy'}; 
  private selectedTextNormal: string = '';
  private border: string = 'none';

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };

  constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    this.userInformation();
    this.getCountryList();
    this.getCategoryList(); 
  }

  selected(imageResult: ImageResult) {
    this.src = imageResult.dataURL;
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


  userInformation(){
    var ref = this;
    ref.loadingSvc.setValue(true);
    ref.apiService.userProfile(function(res){
      ref.loadingSvc.setValue(false);
      if(res.data.country){
        ref.getState(res.data.country);
      }
      if(res.data.state){
        ref.getCIty(res.data.state);
      }                                  
      ref.userInfoArr = res.data;
      ref.favValue = ref.userInfoArr['favorite_category'];
      ref.selectedDateNormal = res.data.dob;
    }, function(error){
      ref.loadingSvc.setValue(false);
      ref.toastyService.error(error.json().message);
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
      }
    });
  }

  getCountryList(){
    var ref = this;
    ref.countryFirst = true;                      
    ref.apiService.countryList(function(res){
      ref.countryList = res.data;
    }, function(err){
      console.log(err);
    });
  }

  getState(id){
    var ref = this;
    ref.cityList=[];
    console.log(ref.cityList);
    ref.countryFirst = false;
    ref.cityFIrst = true;                      
    ref.userInfoArr['state'] = -1;
    ref.apiService.stateList(id,function(res){
      ref.stateListArr = res.data;
    }, function(err){
      console.log(err);
    });
  }

  getCIty(id){
    var ref = this;
    ref.cityFIrst = false;
    ref.userInfoArr['city'] = -1;
    ref.apiService.cityList(id,function(res){
      ref.cityList = res.data;
    }, function(err){
      console.log(err);
    });
  }


          public refreshValue(value:any):void {
            this.favValue = this.convertToValueArray(value);
          }

          public convertArrTopic(value:Array<any> = []):Array<string>{
            return value
            .map((value:any) => {
              return value.category_name;
            });
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
              this.selectedDateNormal = '';
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
            if(this.favValue){
              value['favorite_category']=this.favValue.join(',');
            }
            value['image'] = ref.src;
            if(value['state']==-1){
              value['state']='';
            }
            ref.loadingSvc.setValue(true);
            ref.apiService.updateUser(value,function(res){
              ref.loadingSvc.setValue(false);
              var toastOptions:ToastOptions = {
                title: "Update.!",
                msg: res.message,
                showClose: true,
                timeout: 1000,
                theme: 'bootstrap',
                onAdd: (toast:ToastData) => {

                },
                onRemove: function(toast:ToastData) {
                  ref.router.navigate(['/profile']);
                }
              };
              ref.toastyService.success(toastOptions);
            },function(error){
              ref.loadingSvc.setValue(false);
              if(error.status == 401 || error.status == '401' || error.status == 400){
                localStorage.removeItem('auth_token');        
                ref.apiService.signinSuccess$.emit(false);
                ref.router.navigate(['/index']);
              }
              ref.toastyService.error(error.json().message);
              var error = error.json().errors;
              ref.errors = error; 
            });
          }

        }
