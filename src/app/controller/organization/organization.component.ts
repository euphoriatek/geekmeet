import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { EventListComponent } from '../event/eventlist.component';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-organization',
  templateUrl: '../../view/organization/organization.component.html',
  styleUrls: ['../../assets/css/organization/organization.component.css']
})
export class OrganizationComponent implements OnInit {
  @ViewChild(EventListComponent) event: EventListComponent;
	getToken:any; 
  detailArr:Object = {};
  
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
      this.event.searchEventByOrg(params['id']);
    });

  }

  organizationDetail(value){
    var ref = this;
    ref.loadingSvc.setValue(false);
    ref.apiService.organization_detail(value,function(res){
    ref.loadingSvc.setValue(false);     
      ref.detailArr = res.data;
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





  



  
  

}
