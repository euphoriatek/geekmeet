import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { AgmCoreModule } from 'angular2-google-maps/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {CKEditorModule} from 'ng2-ckeditor';


import {SelectModule} from 'ng2-select/ng2-select';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare const google: any;

@Component({
	selector: 'app-venues-edit',
	templateUrl: '../../view/venues-edit/venues-edit.component.html',
	styleUrls: ['../../assets/css/venues-edit/venues-edit.component.css']
})
export class VenuesEditComponent implements OnInit {
	src: string = "";
	countryList:any;
	getToken:any;
	detailArr:Object = {};
	stateList:any;
	venueId:any;
	cityList:any;
	geocoder:any;
	errors:Object = {};
	center:Object = {
		latitude:51.678418,
		longitude:7.809007
	};
	getLocation = true;
	resizeOptions: ResizeOptions = {
		resizeMaxHeight: 128,
		resizeMaxWidth: 128
	};

	constructor(private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}

		this.route.params.subscribe(params => {
			this.venueDetail(params['id']);
			this.venueId = params['id'];
		});
		this.getCountryList();
	}

	selected(imageResult: ImageResult) {
		this.src = imageResult.dataURL;
	}

	venueDetail(id){
		var ref = this;
		ref.apiService.showVenueDetails(id,function(res){     
			ref.detailArr = res.data;
			if(res.data.country){
				ref.getState(res.data.country);
			}
			if(res.data.state){
				ref.getCIty(res.data.state);
			}
		}, function(err){
			console.log(err);
		});
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
			ref.getLatLong(ref.detailArr);
		}, function(err){
			console.log(err);
		});
	}

	getLatLong(val:any):void{
		console.log(val);
		var ref = this;
			var country = '';
			var state ='';
			var city = '';
			var address = val.address;
			for (var i = 0; i < ref.countryList.length; i++) {
				if(val.country == ref.countryList[i].id){
					country = ref.countryList[i].name;
					break;
				}
			}
			for (var i = 0; i < ref.stateList.length; i++) {
				if(val.state == ref.stateList[i].state_id){
					state = ref.stateList[i].name;
					break;
				}
			}
			console.log(state);
			for (var i = 0; i < ref.cityList.length; i++) {
				if(val.city == ref.cityList[i].city_id){
					city = ref.cityList[i].name;
					break;
				}
			}
			var apiAddress = address+','+city+','+state+' '+country;
			console.log(apiAddress);
			ref.geocoder = new google.maps.Geocoder();
			ref.geocoder.geocode( { 'address': apiAddress}, function(results, status) {
				console.log(status);
				if (status == 'OK') { 
					ref.detailArr['latitude'] = results[0].geometry.location.lat();
					ref.detailArr['longitude'] = results[0].geometry.location.lng();
				}
			});
		
	}

	updateVenue(value:any):void{
		var ref = this;
		value['vanue_id'] = ref.venueId;
		ref.apiService.updateVenue(value,function(res){
			var toastOptions:ToastOptions = {
				title: "Update.!",
				msg: res.message,
				showClose: true,
				timeout: 1000,
				theme: 'bootstrap',
				onRemove: function(toast:ToastData) {ref.router.navigate(['/my-venues']);}
			};
			ref.toastyService.success(toastOptions);
		},function(error){
			ref.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				console.log("profile error");
				localStorage.removeItem('auth_token');        
				ref.apiService.signinSuccess$.emit(false);
				ref.router.navigate(['/index']);
			}
			var error = error.json().errors;
			ref.errors = error;
		});	
	}

}
