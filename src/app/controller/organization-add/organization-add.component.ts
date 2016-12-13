import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';


import {SelectModule} from 'ng2-select/ng2-select';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-organization-add',
  templateUrl: '../../view/organization-add/organization-add.component.html',
  styleUrls: ['../../assets/css/organization-add/organization-add.component.css']
})
export class OrganizationAddComponent implements OnInit {
  src: string = "";
  getToken:any;
  countryList:any;
  stateList:any;
  cityList:any;
  errors:Object = {};
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };

  constructor(private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService,private toastyConfig: ToastyConfig) { 
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
  	this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    this.getCountryList();  
  }

  selected(imageResult: ImageResult) {
    this.src = imageResult.dataURL;
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

  addOrganization(value:any):void{
    var refreg = this;
    console.log("this is update of user profile");
    console.log(value);
    value['image'] = refreg.src;
    this.apiService.addOrganization(value,function(res){
      refreg.router.navigate(['/my-organizations']);
    },function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        refreg.apiService.signinSuccess$.emit(false);
        refreg.router.navigate(['/index']);
      }
      var error = error.json().errors;
      refreg.errors = error;


    });
  }

}
