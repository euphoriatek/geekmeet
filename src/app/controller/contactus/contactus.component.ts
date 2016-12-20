import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-contactus',
  templateUrl: '../../view/contactus/contactus.component.html',
  styleUrls: ['../../assets/css/contactus/contactus.component.css']
})
export class ContactusComponent implements OnInit {
  errors:any={};
  constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) { 
     this.toastyConfig.theme = 'bootstrap';
  }
  
  ngOnInit() {
  }


  contactUs(value){
  var ref = this;
  ref.loadingSvc.setValue(true);
    ref.apiService.contactUs(value,function(res){
      ref.loadingSvc.setValue(false);
      ref.toastyService.success(res.message);
      ref.router.navigate(['/']);
    },function(error){
      ref.loadingSvc.setValue(false);
      ref.toastyService.error(error.json().message);
      var error = error.json().errors;
      ref.errors = error;
    });

  }

}
