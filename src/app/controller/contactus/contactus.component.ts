import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-contactus',
  templateUrl: '../../view/contactus/contactus.component.html',
  styleUrls: ['../../assets/css/contactus/contactus.component.css']
})
export class ContactusComponent implements OnInit {
  errors:any={};
  constructor(private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) { 
     this.toastyConfig.theme = 'bootstrap';
  }
  
  ngOnInit() {
  }


  contactUs(value){
  var ref = this;
    console.log(value);
    ref.apiService.contactUs(value,function(res){
      ref.toastyService.success(res.message);
      ref.router.navigate(['/']);
    },function(error){
      ref.toastyService.error(error.json().message);
      var error = error.json().errors;
      ref.errors = error;
    });

  }

}
