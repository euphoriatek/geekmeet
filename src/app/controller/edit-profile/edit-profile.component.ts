import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import {CKEditorModule} from 'ng2-ckeditor';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

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
  public topicArr:Array<string> = ['Cisco','Database',"Microsoft's",'Networking','Open Source','IT', 'Job'];
  private selectedDateNormal:string = '';

  private selectedTextNormal: string = '';
  private border: string = 'none';
  private myDatePickerNormalOptions = { selectionTxtFontSize: '12px'};
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };

  constructor(private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    this.userInformation();
    this.getCountryList(); 
  }

  selected(imageResult: ImageResult) {
    this.src = imageResult.dataURL;
  }



  userInformation(){
    var ref = this;
    ref.apiService.userProfile(function(res){
      if(res.data.country){
        ref.getState(res.data.country);
      }
      if(res.data.state){
        ref.getCIty(res.data.state);
      }                                  
      ref.userInfoArr = res.data;

      ref.favValue = ref.userInfoArr['favorite_category'];

      console.log(ref.userInfoArr);
      ref.selectedDateNormal = res.data.dob;
    }, function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        console.log("profile error");
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
            console.log(value);
            ref.apiService.updateUser(value,function(res){
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

          onChange(val){
            console.log(val);
          }



        }
