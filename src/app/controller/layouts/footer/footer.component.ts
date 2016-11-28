import { Component, OnInit,Output, ViewContainerRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../../model/api-method.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from 'angular2-modal';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ProfileComponent } from '../../profile/profile.component';


@Component({
	selector: 'app-footer',
	templateUrl: '../../../view/layouts/footer/footer.component.html',
	styleUrls: ['../../../assets/css/layouts/footer/footer.component.css'
	]
})
export class FooterComponent implements OnInit {
	loginModalHidden:boolean = true;
	tokenValueAuth:any;
	usernameErr:any;
	passwordErr:any;
	invalidErr:any;
	name:any;
	useremail:any;
	userPass:any;
	usercnfpass:any;


	constructor(private router: Router, public apiService:ApiMethodService,overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) { 
		overlay.defaultViewContainer = vcRef;
	}

	ngOnInit() {
	}

	resolved(captchaResponse: string) {
		console.log(`Resolved captcha with response ${captchaResponse}:`);
	}


	userSignIn(value:any):void{
		var ref = this;
		this.apiService.userLoginApi(value,function(res){
			console.log("this is api response"+ JSON.stringify(res));
			if(res.data.token){
				ref.router.navigate(['/index']);
			}
			var closeBtn = <HTMLElement>document.getElementById("closeLoginModal");
			closeBtn.click();

		},function(error){
			console.log("this is error res");
			var errors = error.json().errors;
			var cred = JSON.parse(error._body);
			// var cred = error.json()._body;
			// var allErrors = Object.keys(error.json().errors);
			// var myErr = {};
			// for (var i = 0; i < allErrors.length; ++i) {
				// 	var errArr =errors[allErrors[i]];
				// 	var message = "";
				// 	for (var j = 0; j < errArr.length; ++j) {
					// 		if (message.length > 0) {
						// 			message += '\n';
						// 		}
						// 		message += errArr[j];
						// 	}
						// 	myErr[allErrors[i]] = message;
						// }

						console.log(JSON.stringify(cred.error));
						ref.passwordErr = errors.password;
						ref.usernameErr = errors.username;
						// ref.invalidErr  = errors.error;
						// if(cred.error !==""){
						// 	ref.invalidErr = "invalid_credentials or account is deactive";
						// }
						
					});
		

	}



	userSignUp(value:any):void{
		var refreg = this;
		this.apiService.userRegistrationApi(value,function(res){
			console.log("this is api response"+ JSON.stringify(res));
			refreg.router.navigate(['/index']);
			var closeBtn = <HTMLElement>document.getElementById("closeSignupModal");
			closeBtn.click();
		},function(error){
			var errors = error.json().errors;
			refreg.name = errors.username;
			refreg.useremail = errors.email;
			refreg.userPass = errors.password;
			refreg.usercnfpass = errors.password_confirmation;

		});
	}

	signupClick(){
		var closesinBtn = <HTMLElement>document.getElementById("loginModal");
		closesinBtn.click();
	}

	siginClick(){
		var closeloginBtn = <HTMLElement>document.getElementById("signupModal");
		closeloginBtn.click();
	}


}

