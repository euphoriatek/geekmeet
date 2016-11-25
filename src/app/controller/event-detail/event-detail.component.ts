import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-event-detail',
  templateUrl: '../../view/event-detail/event-detail.component.html',
  styleUrls: ['../../assets/css/event-detail/event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
   eventDetail:any
   selectedData:any;
  constructor(private route: ActivatedRoute,private apiService: ApiMethodService) {

   }

  ngOnInit() {
  		this.selectedData = this.route.snapshot.params['id'];
  		// console.log(this.selectedData)
    	this.getEventDetail(this.selectedData);
  

  }

  getEventDetail(value){
            console.log(value);
			var refreg = this;
			this.apiService.EventDetail(value,function(res){
				console.log("this is api response"+ JSON.stringify(res));
			});
		}
}
