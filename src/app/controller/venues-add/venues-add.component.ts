import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { AgmCoreModule } from 'angular2-google-maps/core';

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
	cityList:any;
	center:Object = {
		latitude:51.678418,
		longitude:7.809007
	};
	getLocation = true;
	orgDetail:any = {};
	errors:Object = {};
	resizeOptions: ResizeOptions = {
		resizeMaxHeight: 128,
		resizeMaxWidth: 128
	};
	lat: number = 51.678418;
	lng: number = 7.809007;
	geocoder:any;

	constructor(private router:Router,private route: ActivatedRoute,public apiService:ApiMethodService) { }

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

	getLatLong(){
		var ref = this;
		ref.geocoder = new google.maps.Geocoder();
		ref.geocoder.geocode( { 'address': "Australia"}, function(results, status) {
			console.log(status);
			if (status == 'OK') { 
				console.log(results[0].geometry.location);
				ref.center['latitude'] = results[0].geometry.location.lat();
				ref.center['longitude'] = results[0].geometry.location.lng();
			}
		});
	}

	

}
