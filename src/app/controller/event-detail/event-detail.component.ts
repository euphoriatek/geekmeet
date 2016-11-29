import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-event-detail',
  templateUrl: '../../view/event-detail/event-detail.component.html',
  styleUrls: ['../../assets/css/event-detail/event-detail.component.css','../../assets/css/Templatic-Shortcodes/style.css']
})
export class EventDetailComponent implements OnInit {
   eventDetail:any
   selectedData:any;
   popularArr:any;
   popularTotal:any;
  constructor(private route: ActivatedRoute,private apiService: ApiMethodService) {

   }

  ngOnInit() {
  		this.selectedData = this.route.snapshot.params['id'];
  		// console.log(this.selectedData)
    	this.getEventDetail(this.selectedData);

      this.popularEvent();
  

  }

  getEventDetail(value){
            console.log(value);
			var refreg = this;
			this.apiService.EventDetail(value,function(res){
        refreg.eventDetail = res.data;
        console.log("SDA");
        console.log(refreg.eventDetail.category_id);
			});
		}
    popularEvent(){
    var ref = this;
    this.apiService.popularEventApi(function(res){
     ref.popularArr = res.data.data;
     ref.popularTotal = res.total;      
    });

  }
}
