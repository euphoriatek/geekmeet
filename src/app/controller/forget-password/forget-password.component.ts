import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { LoadingAnimateService } from 'ng2-loading-animate';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-forget-password',
  templateUrl: '../../view/forget-password/forget-password.component.html',
  styleUrls: ['../../assets/css/forget-password/forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
   errors:any={};

  constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService,private toastyConfig: ToastyConfig) { }

  ngOnInit() {
  }

  resetPasswordLink(value:any):void{
  	var refreg = this;
    refreg.loadingSvc.setValue(true);
    this.apiService.forgotPassword(value,function(res){
      refreg.loadingSvc.setValue(false);
      refreg.toastyService.success(res.message);
      refreg.router.navigate(['/index']);
    },function(error){
      refreg.loadingSvc.setValue(false);
      refreg.toastyService.error(error.json().message);
      var error = error.json().errors;
      refreg.errors = error;
    });
  }

}
