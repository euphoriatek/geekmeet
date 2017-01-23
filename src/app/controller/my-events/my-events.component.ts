import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var jQuery:any;

@Component({
	selector: 'app-my-events',
	templateUrl: '../../view/my-events/my-events.component.html',
	styleUrls: ['../../assets/css/my-events/my-events.component.css']
})
export class MyEventsComponent implements OnInit {
	eventArr:any=[];
	Total:Object;
	currentPage:Object;
	getToken:any;
	deleteID:any;
	category:any;
	type:any;
	sort:any;
	page:any;
	per_page:any;
	showData:any;


	constructor(private loadingSvc: LoadingAnimateService,private router: Router, public apiService:ApiMethodService,public toastyService:ToastyService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';

	}


	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		this.eventList('','','',1);
	}


	eventList(category,type,sort,page){
		var ref = this;
		ref.category = category;
		ref.type = type; 
		ref.sort = sort;
		ref.page = page;
		ref.loadingSvc.setValue(true);
		var eventArrData = {
			"category": ref.category,
			"type":ref.type,
			"sort":ref.sort,
			"all": "true",
			"page":ref.page,
			"my-event":"true"
		}
		this.apiService.eventApi(eventArrData,function(res){
			window.scrollTo(0,0);
			ref.eventArr = res.data.data;
			ref.Total = res.data.total;
			ref.per_page = res.data.per_page;
			ref.currentPage = res.data.current_page;
			if(ref.eventArr == [] || ref.eventArr == ''){
				ref.showData = "No Data Found.!"
			}
			else{
				ref.showData = '';
			}
			ref.loadingSvc.setValue(false);   			
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



	createRange(number){
		var links = [];
		for(var i = 1; i <= number; i++){
			links.push(i);
		}

		return links;
	}

	getEventPagination(page){
		this.page = page;
		this.eventList('','',this.sort,page);
	}



	setDeleteID(id){
		this.deleteID = id;
	}

	sortEventsData(sort){
		this.sort = sort;
		var category = this.category;
		var sort = this.sort;
		var type = this.type;
		var page = this.page;
		this.eventList(category,type,sort,page);
	}



	deleteOrg(){
		var ref = this;
		ref.loadingSvc.setValue(true);
		this.apiService.eventAttendanceDelete(this.deleteID,function(res){
			ref.loadingSvc.setValue(false);
			ref.toastyService.success(res.message);
			ref.eventList('','',ref.sort,ref.currentPage);       
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
