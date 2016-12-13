import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {DropdownModule} from "ng2-dropdown";
// import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import {CKEditorModule} from 'ng2-ckeditor';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
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
  private favValue:any = [];
  private topicData:any = [];
  countryList:any;
  stateListArr:any;
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
    // this.getFavTopics();
  }

  addToast() {
    // Just add default Toast with title only
    this.toastyService.default('Hi there');
    // Or create the instance of ToastOptions
    // var toastOptions:ToastOptions = {
      //     title: "My title",
      //     msg: "The message",
      //     showClose: true,
      //     timeout: 5000,
      //     theme: 'bootstrap',
      //     onAdd: (toast:ToastData) => {
        //         console.log('Toast ' + toast.id + ' has been added!');
        //     },
        //     onRemove: function(toast:ToastData) {
          //         console.log('Toast ' + toast.id + ' has been removed!');
          //     }
          // };
          // Add see all possible types in one shot
          // this.toastyService.info(toastOptions);
          // this.toastyService.success(toastOptions);
          // this.toastyService.wait(toastOptions);
          // this.toastyService.error(toastOptions);
          // this.toastyService.warning(toastOptions);
        }



        selected(imageResult: ImageResult) {
          this.src = imageResult.dataURL;
        }

        // ngAfterViewInit() {
          //   jQuery(document).find("#multiple").select2({
            //     width: '100%',
            //     start: function (select2) {
              //       jQuery('.edit_profile__module').removeClass('loading');
              //     }
              //   });

              // }


              // getFavTopics(){
                //   var ref= this;
                //   ref.apiService.categoryList(function(res){
                  //     ref.newTopic = this.convertArrTopic(res.data);
                  //     console.log(ref.newTopic);
                  //   },function(err){
                    //     console.log(err);
                    //   })
                    // }



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
                              console.log(value);
                              console.log("this is update of user profile");
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
                                var errors = error.json().errors;
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
