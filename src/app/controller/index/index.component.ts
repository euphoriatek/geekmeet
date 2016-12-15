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

	constructor(private router: Router,public apiService:ApiMethodService,private location: Location) { }

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
		this.apiService.popularEventApi(value,function(res){
			ref.popularArr = res.data.data;	
			ref.Total = res.data.last_page;
            ref.currentPage = res.data.current_page;  
		});

	 }


	getPopularGridView(){
    var ref = this;
    ref.all = false;
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
		var ref = this;
		var value = {
        'category': ref.category,
        'sort':ref.sort,
        'all':ref.upcoming_all,
        'page':ref.upcoming_page
        }
		this.apiService.upcomingEventApi(value,function(res){
			ref.upcomingArr = res.data.data;
			ref.upcoming_total = res.data.last_page;
            ref.upcoming_currentPage = res.data.current_page;  		
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
		this.upcomingEvent();
	}


	goToEventDetail(id){
		this.router.navigate(['/event_detail',id]);
		// this.location.replaceState("/event_detail/"+id);
		// this.router.navigateByUrl('/event_detail',id);
	}


	addFavorite(event_id,favorite){
	var ref = this;	
    var value = {
    'event_id':event_id,
    'favorite':favorite
    }

    ref.apiService.favoriteApi(value,function(res){
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
		this.popularEvent();
   }

   upcomingEventPagination(page_no){
        var ref = this;
		ref.events = "All Upcoming Events";
		ref.upcoming_all = true;
		ref.upcoming_page = page_no;
		this.upcomingEvent();
   }



}
