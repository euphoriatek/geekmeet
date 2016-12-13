import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DeleteModelComponent } from '../delete-model/delete-model.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';


@Component({
	selector: 'app-my-venues',
	templateUrl: '../../view/my-venues/my-venues.component.html',
	styleUrls: ['../../assets/css/my-venues/my-venues.component.css']
})
export class MyVenuesComponent implements OnInit {

	venueArr:any;
	Total:Object;
	currentPage:Object;
	getToken:any;
	deleteID:any;



	constructor(private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}
	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		this.venueList(1);
	}


	venueList(value){
		var ref = this;
		this.apiService.showVenueList(value,function(res){
			window.scrollTo(0, 0);
			ref.venueArr = res.data.data;
			ref.Total = res.data.last_page;
			ref.currentPage = res.data.current_page;   			
		},function(error){
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

	getVenuePagination(page){
		this.venueList(page);
	}

	setDeleteID(id){
		console
		this.deleteID = id;
	}

	deleteVenue(){
		var ref = this;
		console.log(this.deleteID);
		this.apiService.deleteVanue(this.deleteID,function(res){
			var toastOptions:ToastOptions = {
				title: "Delete.!",
				msg: res.message,
				showClose: true,
				timeout: 1000,
				theme: 'bootstrap',
				onRemove: function(toast:ToastData) {ref.venueList(1);}
			};
			ref.toastyService.success(toastOptions);

		},function(error){
			if(error.status == 401 || error.status == '401' || error.status == 400){
				localStorage.removeItem('auth_token');        
				ref.apiService.signinSuccess$.emit(false);
				ref.router.navigate(['/index']);
			}
		});
	}

}
