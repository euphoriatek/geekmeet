import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-forget-password',
  templateUrl: '../../view/forget-password/forget-password.component.html',
  styleUrls: ['../../assets/css/forget-password/forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  resetPasswordLink(value:any):void{
  	console.log(value);
  }

}
