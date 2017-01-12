import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-changepassword',
  templateUrl: '../../view/changepassword/changepassword.component.html',
  styleUrls: ['../../assets/css/changepassword/changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  getToken:any;
  errors:Object = {};

  constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
  	this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
  }


  updatePassword(value:any):void{
    var ref = this;
    ref.loadingSvc.setValue(true);
    console.log(value);
    ref.apiService.changePassword(value,function(res){
      ref.loadingSvc.setValue(false);
      ref.toastyService.success(res.message);
      if(res){
        ref.apiService.userLogoutApi(function(res){
          localStorage.removeItem('auth_token');
          ref.getToken="";
          ref.apiService.signinSuccess$.emit(false);
          ref.router.navigate(['/']);
        },function(error){
          ref.toastyService.error(error.json().message);
        })
      }


    },function(error){
      ref.loadingSvc.setValue(false);
      ref.toastyService.error(error.json().message);
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
      }
      var error = error.json().errors;
      ref.errors = error;
    });
  }

}
