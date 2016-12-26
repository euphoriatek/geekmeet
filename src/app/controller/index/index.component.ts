import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
import {Location} from '@angular/common';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var jQuery:any;
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
	type:any = "event";
	view_type:any="chronological";
	category:any='';
	sort:any = '';
	all:any = false;
	page:any = 1;
	upcoming_all:any = false;
	upcoming_page:any = 1;
	upcoming_heading:any;
	Total:any;
	currentPage:any;
	upcoming_total:any;
	upcoming_currentPage:any;
	currentPos:any;
	showData:any = '';
	showUpcomingData:any = '';

	constructor(private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private location: Location,public toastyService:ToastyService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		this.getPopularGridView();
		this.latestUpcomingEvents();
	}




	popularEvent(){
		var ref = this;
		var value = {
			'category': ref.category,
			'sort':ref.sort,
			'all':ref.all,
			'page':ref.page
		}
		ref.loadingSvc.setValue(true);
		this.apiService.popularEventApi(value,function(res){
			ref.loadingSvc.setValue(false);
			ref.popularArr = res.data.data;	
			   if(ref.popularArr == [] || ref.popularArr == ''){
          ref.showData = "No Data Found.!"
        }
        else{
          ref.showData = '';
        }
			ref.Total = res.data.last_page;
			ref.currentPage = res.data.current_page;  
		},function(error){
			ref.loadingSvc.setValue(false);
			ref.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				localStorage.removeItem('auth_token');        
				ref.apiService.signinSuccess$.emit(false);
				if(ref.router.url=='/index'){
					ref.router.navigate(['/']);       
				}
				else{
					ref.router.navigate(['/index']);
				} 
			}
		});

	}


	getPopularGridView(){
		var ref = this;
		ref.all = false;
		ref.page = 1;
		ref.view_type = "chronological"
		ref.events = "Popular Events";
		this.popularEvent();
	}


	getPopularListView(){
		var ref = this;
		ref.view_type = "list";
		ref.events = "All Popular Events";
		ref.all = true;
		this.popularEvent();
	}


	upcomingEvent(){
		// window.scrollTo(0,1800);
		var ref = this;
		var value = {
			'category': ref.category,
			'sort':ref.sort,
			'all':ref.upcoming_all,
			'page':ref.upcoming_page
		}
		ref.loadingSvc.setValue(true);
		this.apiService.upcomingEventApi(value,function(res){
			ref.loadingSvc.setValue(false);
			ref.upcomingArr = res.data.data;
				   if(ref.upcomingArr == [] || ref.upcomingArr == ''){
          ref.showUpcomingData = "No Data Found.!"
        }
        else{
          ref.showUpcomingData = '';
        }
			ref.upcoming_total = res.data.last_page;
			ref.upcoming_currentPage = res.data.current_page;  		
		},function(error){
			ref.loadingSvc.setValue(false);
			ref.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				localStorage.removeItem('auth_token');        
				ref.apiService.signinSuccess$.emit(false);
				if(ref.router.url=='/index'){
					ref.router.navigate(['/']);       
				}
				else{
					ref.router.navigate(['/index']);
				} 
			}
		});

	}


	onchange(event){  
		var ref =this;
		ref.category = event;
		this.popularEvent();
		this.upcomingEvent();
	}

	


	showAllUpcomingEvents(){
		var ref = this;
		ref.upcoming_all = true;
		ref.upcoming_heading = "All Upcoming Events";
		this.upcomingEvent();
	}

	latestUpcomingEvents(){
		var ref = this;
		ref.upcoming_heading = "Upcoming Events";
		ref.upcoming_all = false;
		ref.upcoming_page = 1;
		console.log(ref.upcoming_page);
		this.upcomingEvent();
	}


	goToEventDetail(id){
		this.router.navigate(['/event_detail',id]);
	}


	addFavorite(event_id,favorite){
		var ref = this;	
		var value = {
			'event_id':event_id,
			'favorite':favorite
		}
		ref.loadingSvc.setValue(true);
		ref.apiService.favoriteApi(value,function(res){
			ref.loadingSvc.setValue(false);
			ref.popularEvent();
			ref.upcomingEvent();	
		});


	}

	createRange(number){
		var links = [];
		for(var i = 1; i <= number; i++){
			links.push(i);
		}

		return links;
	}

	eventPagination(page_no){
		var ref = this;
		ref.view_type = "list";
		ref.events = "All Popular Events";
		ref.all = true;
		ref.page = page_no;
		window.scrollTo(0,500);
		this.popularEvent();
	}

	upcomingEventPagination(page_no){
		var ref = this;
		ref.events = "All Upcoming Events";
		ref.upcoming_all = true;
		ref.upcoming_page = page_no;
		// window.scrollTo(0,-1000);
		this.upcomingEvent();
	}


	search(value){
      console.log(value);

	}



}
