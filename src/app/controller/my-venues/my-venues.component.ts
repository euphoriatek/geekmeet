import { Component, OnInit } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DeleteModelComponent } from '../delete-model/delete-model.component';

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


	constructor(private router:Router, public apiService:ApiMethodService) { }

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		this.venueList();
	}


	venueList(){
		var ref = this;
		this.apiService.venueNames(function(res){
			ref.venueArr = res.data.data;
			ref.Total = res.data.last_page;
			ref.currentPage = res.data.current_page;   			
		},function(err){
			console.log(err);
		});
	}

}
