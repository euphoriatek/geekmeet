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
// import {FacebookService, FacebookInitParams} from 'ng2-facebook-sdk/dist';

declare const FB: any;
declare const IN: any;
declare var Auth0Lock;
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
	token: any;
	loged: boolean = false;
	user = { name: 'Hello' };
	fbUserInfo:any;
	fbtoken:any;
	fbuserid:any;
	first_name:any;
	image:any;
	last_name:any;


	constructor(private router: Router,
		public apiService:ApiMethodService,
		overlay: Overlay,
		vcRef: ViewContainerRef,
		public modal: Modal
		){ 
		overlay.defaultViewContainer = vcRef;
		FB.init({
			appId      : '1840931362816112',
			cookie     : false, 
			xfbml      : true,  
			version    : 'v2.8' 
		});
	}


	statusChangeCallback(response: any) {
		if (response.status === 'connected') {
			console.log('connected');
		} else {
			this.login();
		}
	}

	login() {
		var refTokn = this;
		FB.login(function(result) {
			refTokn.loged = true;
			refTokn.token = result;
			// localStorage.setItem('auth_token', refTokn.token.authResponse.accessToken);
			console.log(refTokn.token.authResponse);

				refTokn.fbtoken= refTokn.token.authResponse.accessToken,
				refTokn.fbuserid=refTokn.token.authResponse.userID

			if(refTokn.token.authResponse.accessToken){
				refTokn.me(refTokn.fbtoken);
			}
			var closeBtn = <HTMLElement>document.getElementById("closeSignupModal");
			closeBtn.click();
		}, { scope: 'user_friends' });
	}

	me(token) {
		FB.api('/me?fields=id,name,first_name,picture.width(150).height(150),last_name,email',
			function(result) {
				if (result && !result.error) {
					this.user = result;
					console.log("user info");
					console.log(this.user);
					this.fbUserInfo = {
						'first_name':this.user.first_name,
						'image':this.user.picture.data.url,
						'last_name': this.user.last_name,
						'token': token
					};
					console.log(this.fbUserInfo);
					

				} else {
					console.log(result.error);
				}
			});
		console.log("this is fb info array");
		
		
	}
	


	ngOnInit() {
		
	}
	loginWithFb(){
		FB.getLoginStatus(response => {
			this.statusChangeCallback(response);
		});
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

	closeModal(){
		this.name = "";
		this.useremail = "";
		this.userPass = "";
		this.usercnfpass = "";
		this.passwordErr = "";
		this.usernameErr = "";
	}

	//  lock = new Auth0Lock('s7ln1gfIaFpcWTltHp9TExmkLrmfPl6L','kundan12.auth0.com/oauth/token');

	// loginLinked() {
 //    var hash = this.lock.parseHash();
 //    if (hash) {
 //      if (hash.error)
 //        console.log('There was an error logging in', hash.error);
 //      else
 //        this.lock.getProfile(hash.id_token, function(err, profile) {
 //          if (err) {
 //            console.log(err);
 //            return;
 //          }
 //          localStorage.setItem('profile', JSON.stringify(profile));
 //          localStorage.setItem('id_token', hash.id_token);
 //        });
 //    }
 //  }


}

