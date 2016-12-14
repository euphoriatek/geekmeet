import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {Location} from '@angular/common';

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
	constructor(private router: Router,public apiService:ApiMethodService,private location: Location) { }

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
		var eventArr = {
			"category": event,
			"type": "",
			"sort":"",
			"all": "false"
		}
		this.apiService.eventApi(eventArr,function(res){
			ref.popularArr = res.data.data;
		});
	}

	showAllEvents(){
		var ref = this;
		ref.events = "Events";
		var eventArr = {
			"category": "",
			"type": "",
			"sort":"",
			"all": "true"
		}
		ref.apiService.eventApi(eventArr,function(res){
			ref.popularArr = res.data;
			console.log("this is event api response"+ JSON.stringify(res));			
		});
	}

	goToEventDetail(id){
		this.router.navigate(['/event_detail',id]);
		// this.location.replaceState("/event_detail/"+id);
		// this.router.navigateByUrl('/event_detail',id);
	}


	addFavorite(event_id){

		console.log(event_id);
	}



}
