import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { LoadingAnimateService } from 'ng2-loading-animate';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-reset-password',
  templateUrl: '../../view/reset-password/reset-password.component.html',
  styleUrls: ['../../assets/css/reset-password/reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  forgot_token:any = '';
  errors:any={};
  constructor(private loadingSvc: LoadingAnimateService,private router: Router,private route: ActivatedRoute,public apiService:ApiMethodService,private toastyService:ToastyService,private toastyConfig: ToastyConfig) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
			this.forgot_token = params['id'];
    });

    this.checkForgotToken(this.forgot_token);
  }

  

    checkForgotToken(value){
		var ref = this;
    ref.loadingSvc.setValue(true);
    ref.apiService.checkForgotToken(value,function(res){
    ref.loadingSvc.setValue(false);     
			console.log(res);
			
		}, function(error){
      ref.toastyService.error(error.json().message);
      ref.router.navigate(['/index']);
    });
	}

  resetPassword(value){
    var ref = this;
 
     ref.loadingSvc.setValue(true);
    value.token = this.forgot_token;
    ref.apiService.resetPassword(value,function(res){
       ref.loadingSvc.setValue(false);
      ref.toastyService.success(res.message);
      ref.router.navigate(['/']);
    },function(error){
          ref.loadingSvc.setValue(false);
     
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
