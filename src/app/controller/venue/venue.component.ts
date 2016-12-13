import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { EventListComponent } from '../event/eventlist.component';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';



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

  constructor(private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
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
    ref.apiService.showVenueDetails(value,function(res){     
      ref.detailArr = res.data;
      ref.imageArr = res.data.images[0];
    }, function(err){
      console.log(err);
    });
  }

}
