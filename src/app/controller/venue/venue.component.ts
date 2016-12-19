import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { EventListComponent } from '../event/eventlist.component';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-venue',
  templateUrl: '../../view/venue/venue.component.html',
  styleUrls: ['../../assets/css/venue/venue.component.css']
})
export class VenueComponent implements OnInit {
	getToken:any; 
  detailArr:Object = {};
  imageArr:Object = {};

  constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
  }
  
  ngOnInit() {
  	this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }

    this.route.params.subscribe(params => {
      this.VenueDetails(params['id']);
    });

  }

  VenueDetails(value){
    var ref = this;
    ref.loadingSvc.setValue(true);
    ref.apiService.showVenueDetails(value,function(res){ 
    ref.loadingSvc.setValue(false);    
      ref.detailArr = res.data;
      ref.imageArr = res.data.images[0];
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
