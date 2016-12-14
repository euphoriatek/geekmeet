import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'app-profile',
	templateUrl: '../../view/profile/profile.component.html',
	styleUrls: ['../../assets/css/profile/profile.component.css']
})
export class ProfileComponent implements OnInit {
	getToken:any;
	userInfoArr:Object = {};

constructor(private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}
	ngOnInit() {
		this.getToken = localStorage.getItem('auth_token');
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		this.userInformation();	
	}


	userInformation(){
		var ref = this;
		ref.apiService.userProfile(function(res){
			// console.log(JSON.stringify(res));
			ref.userInfoArr = res.data;
			console.log(ref.userInfoArr);
		}, function(error){
			ref.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				localStorage.removeItem('auth_token');				
				ref.apiService.signinSuccess$.emit(false);
				ref.router.navigate(['/index']);
			}
		});
	}

}
