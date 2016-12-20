import { Component, OnInit } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-my-organizations',
  templateUrl: '../../view/my-organizations/my-organizations.component.html',
  styleUrls: ['../../assets/css/my-organizations/my-organizations.component.css']
})
export class MyOrganizationsComponent implements OnInit {
  organizationArr:any=[];
  Total:Object;
  currentPage:Object;
  getToken:any;
  deleteID:any;

  constructor(private loadingSvc: LoadingAnimateService,private router: Router, public apiService:ApiMethodService,public toastyService:ToastyService,private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';

  }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    this.OrganizationList(1);

  }

  OrganizationList(value){
    var ref = this;
    ref.loadingSvc.setValue(true);
    this.apiService.organizationList(value,function(res){
      window.scrollTo(0,0);
      ref.loadingSvc.setValue(false);
      ref.organizationArr = res.data.data;
      ref.Total = res.data.last_page;
      ref.currentPage = res.data.current_page;   			
    },function(error){
      ref.loadingSvc.setValue(false);
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
      }
    });
  }

  createRange(number){
    var links = [];
    for(var i = 1; i <= number; i++){
      links.push(i);
    }
    
    return links;
  }

  getOrganizationPagination(page){
    this.OrganizationList(page);
  }

  setDeleteID(id){
    this.deleteID = id;
  }

  deleteOrg(){
    var ref = this;
    ref.loadingSvc.setValue(true);
    this.apiService.organizationDelete(this.deleteID,function(res){
      ref.loadingSvc.setValue(false);
      ref.toastyService.success(res.message);
      ref.OrganizationList(ref.currentPage);        
    },function(error){
      ref.loadingSvc.setValue(false);
      ref.toastyService.error(error.json().message);
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
      }
    });
  }

}
