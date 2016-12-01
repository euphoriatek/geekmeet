import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
	selector: 'app-index',
	templateUrl: '../../view/index/index.component.html',
	styleUrls: ['../../assets/css/index/index.component.css']
})
export class IndexComponent implements OnInit {
	getToken:any;
	eventArr:any;
	popularArr:any;
	upcomingArr:any;
	events:any;
	constructor(private router: Router,public apiService:ApiMethodService) { }

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		this.popularEvent(1);
		this.upcomingEvent();
	}

	popularEvent(value){
		var ref = this;
		ref.events = "Popular Events";
		this.apiService.popularEventApi(value,function(res){
			ref.popularArr = res.data.data;	
		});
	}


	upcomingEvent(){
		var ref = this;
		this.apiService.upcomingEventApi(function(res){
			ref.upcomingArr = res.data;		
		});
	}


	onchange(event){
		var ref =this;
		this.apiService.EventCategoryApi(event,function(res){
			ref.popularArr = res.data.data;
		});
	}

	showAllEvents(){
		var ref = this;
		ref.events = "Events"
		ref.apiService.eventApi(function(res){
			ref.popularArr = res.data;
			console.log("this is event api response"+ JSON.stringify(res));			
		});
	}



}
