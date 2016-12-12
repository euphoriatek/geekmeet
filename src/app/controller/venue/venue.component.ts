import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { EventListComponent } from '../event/eventlist.component';


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

  constructor(private router: Router,private route: ActivatedRoute,public apiService:ApiMethodService) { }

  ngOnInit() {
  // 	this.getToken = this.apiService.getLoginToken();
		// if(!(this.getToken)){
		// 	this.router.navigate(['/']);
		// }

  //    this.route.params.subscribe(params => {
  //     this.organizationDetail(params['id']);
  //     });

  }

  //   organizationDetail(value){
  //   var ref = this;
  //   ref.apiService.organization_detail(value,function(res){     
  //     ref.detailArr = res.data;
  //   }, function(err){
  //     console.log(err);
  //   });
  // }

}