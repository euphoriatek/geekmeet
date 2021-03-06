import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {CKEditorModule} from 'ng2-ckeditor';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { LoadingAnimateService } from 'ng2-loading-animate';

import {SelectModule} from 'ng2-select/ng2-select';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-organization-edit',
  templateUrl: '../../view/organization-edit/organization-edit.component.html',
  styleUrls: ['../../assets/css/organization-edit/organization-edit.component.css']
})
export class OrganizationEditComponent implements OnInit {
  src: string = "";
  getToken:any;
  countryList:any;
  stateList:any;
  cityList:any;
  orgDetail:any = {};
  errors:Object = {};
  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 128,
    resizeMaxWidth: 128
  };
  constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,public apiService:ApiMethodService,private toastyService:ToastyService,private toastyConfig: ToastyConfig) { 
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
  	this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }

    this.route.params.subscribe(params => {
      this.organizationDetail(params['id']);
    });
    this.getCountryList(); 
  }

  selected(imageResult: ImageResult) {
    this.src = imageResult.dataURL;
  }



  organizationDetail(value){
    var ref = this;
    ref.loadingSvc.setValue(true);
    ref.apiService.organization_detail(value,function(res){
    ref.loadingSvc.setValue(false);    
      ref.orgDetail = res.data;
      ref.getState(res.data.country);
      ref.getCIty(res.data.state);
      console.log(ref.orgDetail);
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

  editOrganization(value:any):void{
    var refreg = this;
    value['image'] = refreg.src;
    console.log(value);
    this.apiService.editOrganization(value,function(res){
      refreg.toastyService.success(res.message); 
      refreg.router.navigate(['/my-organizations']);
    },function(err){
      refreg.toastyService.error(error.json().message);
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        refreg.apiService.signinSuccess$.emit(false);
        refreg.router.navigate(['/index']);
      }
      var error = err.json().errors;
      refreg.errors = error;


    });
  }

}
