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
	selector: 'app-venues-add',
	templateUrl: '../../view/venues-add/venues-add.component.html',
	styleUrls: ['../../assets/css/venues-add/venues-add.component.css']
})
export class VenuesAddComponent implements OnInit {
	src: string = "";
	getToken:any;
	countryList:any;
	stateList:any;
	locationErr:any;
	cityList:any;
	center:Object = {};
	getLocation = false;
	orgDetail:any = {};
	errors:Object = {};
	resizeOptions: ResizeOptions = {
		resizeMaxHeight: 128,
		resizeMaxWidth: 128
	};
	geocoder:any;

	constructor(private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		this.getCountryList();
	}

	selected(imageResult: ImageResult) {
		this.src = imageResult.dataURL;
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

	getLatLong(val){
		var ref = this;
		if(val.country=='' || val.state ==''){
			ref.locationErr = "Please Select Contry or State";
		}
		else{
			ref.getLocation = true;
			ref.locationErr = '';
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
				if (status == 'OK') { 
					ref.center['latitude'] = results[0].geometry.location.lat();
					ref.center['longitude'] = results[0].geometry.location.lng();
				}
			});
		}
		
	}



	addVenue(value:any):void{
		var ref = this;
		ref.apiService.addVenue(value,function(res){
			var toastOptions:ToastOptions = {
				title: "Add.!",
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
