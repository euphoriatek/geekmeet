import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import {DropdownModule} from "ng2-dropdown";
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

import {SelectModule} from 'ng2-select/ng2-select';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'app-venues-edit',
	templateUrl: '../../view/venues-edit/venues-edit.component.html',
	styleUrls: ['../../assets/css/venues-edit/venues-edit.component.css']
})
export class VenuesEditComponent implements OnInit {
	countryList:any;
	getToken:any;
	stateList:any;
	cityList:any;
	errors:Object = {};

	constructor(private router:Router,private route: ActivatedRoute,public apiService:ApiMethodService) { }

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}

		this.route.params.subscribe(params => {
			this.venueDetail(params['id']);
		});
		this.getCountryList();
	}

	venueDetail(id){

	}

	getCountryList(){
		var ref = this;
		ref.apiService.countryList(function(res){
			ref.countryList = res.data;
		}, function(err){
			console.log(err);
		});
	}

	getState(id){
		var ref = this;
		ref.apiService.stateList(id,function(res){
			ref.stateList = res.data;
		}, function(err){
			console.log(err);
		});
	}

	getCIty(id){
		var ref = this;
		ref.apiService.cityList(id,function(res){
			ref.cityList = res.data;
		}, function(err){
			console.log(err);
		});
	}

	updateVenue(){

	}

}
