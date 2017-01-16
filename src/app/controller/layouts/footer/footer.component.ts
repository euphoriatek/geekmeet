import { Component, OnInit,Output, ViewContainerRef, EventEmitter, NgZone, ViewChild } from '@angular/core';
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
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {FacebookService, FacebookLoginResponse, FacebookInitParams} from 'ng2-facebook-sdk/dist';

declare const FB: any;
declare const IN: any;
declare var Auth0Lock;
declare var proxy:any;
declare var jQuery: any;
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
	user_name:any;
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
	param_id:any;
	linkedInData:any;
	subemail:any;
	subname:any
	reset_password:any
	menuArr:any;
	blogArr:any;

	errors:Object = {};
	suberror:Object = {};


	constructor(private router: Router,
		public apiService:ApiMethodService,
		overlay: Overlay,
		vcRef: ViewContainerRef,
		private loadingSvc: LoadingAnimateService,
		private zone : NgZone,
		private toastyService:ToastyService,
		private toastyConfig: ToastyConfig
		){ 


		overlay.defaultViewContainer = vcRef;
		FB.init({
			appId      : '1840931362816112',
			cookie     : false, 
			xfbml      : true,  
			version    : 'v2.8' 
		});

		// this.zone.run(() => {
			// 	this.proxy(this.OnLinkedInFrameworkLoad, this);
			// });
		}


		statusChangeCallback(response: any) {
			if (response.status === 'connected') {
				this.login();
			} else {
				this.login();
			}
		}

		login() {
			var refTokn = this;
			FB.login(function(result) {
				refTokn.loged = true;
				refTokn.token = result;
				console.log(refTokn.token.authResponse);
				refTokn.fbtoken= refTokn.token.authResponse.accessToken,
				refTokn.fbuserid=refTokn.token.authResponse.userID
				if(refTokn.token.authResponse.accessToken){
					refTokn.me(refTokn.fbtoken);
				}
				
			}, { scope: 'user_friends' });
		}

		me(token) {
			var ref = this;
			FB.api('/me?fields=id,name,first_name,picture.width(150).height(150),last_name,email',
				function(result) {
					if (result && !result.error) {
						this.user = result;
						console.log(this.user);
						this.fbUserInfo = {
							'first_name':this.user.first_name,
							'image':this.user.picture.data.url,
							'last_name': this.user.last_name,
							'token': this.user.id
						};
						console.log(this.fbUserInfo);
						ref.userSocialLogin(this.fbUserInfo);				

					} else {
						console.log(result.error);
					}
				});		
		}



		ngOnInit() {
			var linkedIn = document.createElement("script");
			linkedIn.type = "text/javascript";
			linkedIn.src = "http://platform.linkedin.com/in.js";
			linkedIn.innerHTML = "\n"+
			"api_key: 812nofjpm8avr4\n"
			document.head.appendChild(linkedIn);

			var script = document.createElement("script");
			document.body.appendChild(script);
			this.secondmenuDeafault();
			this.blogCategory();
			var footerref = this;
			this.apiService.setFooterRef(footerref);			
		}


		openLoginFormForNewUser(){
			setTimeout(function(){ jQuery('#signInFormModal').click(); }, 500);
		}
		OnLinkedInFrameworkLoad(){
			var ref = this;
			var callbackFunction = function(){
				IN.API.Raw("/people/~").result(result => onSuccess(result));
			}
			var callbackScope = function(error){
				console.log(error);
			}
			var resultCallback = function(){

			}
			var getProfileData = function(){
				// IN.API.Raw("/people/~").result(result => console.log(result));
				
			}
			var onSuccess = function(data) {
				console.log("linkedin data");
				ref.linkedInData = {
					'first_name':data.firstName,
					'last_name':data.lastName,
					'token':data.siteStandardProfileRequest.url
				}
				console.log(ref.linkedInData);
				ref.userSocialLogin(ref.linkedInData);

			}
			IN.User.authorize(callbackFunction,callbackScope);
		}
		

		loginWithFb(){
			FB.getLoginStatus(response => {
				this.statusChangeCallback(response);
			});
		}

		resolved(captchaResponse: string) {
			console.log(`Resolved captcha with response ${captchaResponse}:`);
		}


		userSignIn(userData:any):void{
			var ref = this;
			var value = userData.value;
			ref.loadingSvc.setValue(true);
			this.apiService.userLoginApi(value,function(res){
				ref.loadingSvc.setValue(false);
				ref.toastyService.success(res.message);
				if(res.data.token){
					var closeBtn = <HTMLElement>document.getElementById("closeLoginModal");
					closeBtn.click();
					userData.reset();
					if(ref.router.url=='/'){
						ref.router.navigate(['/index']);
					}
					else{
						ref.router.navigate(['/']);
					}
					ref.apiService.userProfile(function(res){
						ref.apiService.signinSuccess$.emit(true);
					}, function(error){
					});
				}
			},function(error){
				ref.loadingSvc.setValue(false);
				if(error.status == 401 || error.status == '401' || error.status == 400){
					var pwderror = error.json().message;
					ref.reset_password = pwderror;
					ref.errors = {};
					// ref.toastyService.error(error.json().message);
					
				}
				else{
					var errors = error.json().errors;
					ref.errors = errors;
					this.reset_password=null;
					ref.toastyService.error(error.json().message);	
				}
				
			});

		}



		userSignUp(userData:any):void{
			var refreg = this;
			var value = userData.value;
			refreg.loadingSvc.setValue(true);
			this.apiService.userRegistrationApi(value,function(res){ 
				refreg.loadingSvc.setValue(false);
				var toastOptions:ToastOptions = {
					title: "Registration.!",
					msg: res.message,
					showClose: true,
					timeout: 30000,
					theme: 'bootstrap',
					onAdd: (toast:ToastData) => {

					}
				};
				refreg.toastyService.success(toastOptions);
				refreg.router.navigate(['/index']);
				var closeBtn = <HTMLElement>document.getElementById("closeSignupModal");
				closeBtn.click();
				userData.reset();
			},function(error){
				refreg.loadingSvc.setValue(false);
				refreg.toastyService.error(error.json().message);
				var errors = error.json().errors;
				refreg.errors = errors; 
			});
		}

		signupClick(){
			var closesinBtn = <HTMLElement>document.getElementById("loginModal");
			console.log(closesinBtn)
			closesinBtn.click();
			jQuery('#closeLoginModal').click();	
			this.reset_password=null;		
			setTimeout(function(){ jQuery('#signUpFormModal').click(); }, 500);					
		}

		siginClick(){
			var closeloginBtn = <HTMLElement>document.getElementById("signupModal");
			closeloginBtn.click();
			jQuery('#closeSignupModal').click();
			this.reset_password=null;			
			setTimeout(function(){ jQuery('#signInFormModal').click(); }, 500);	
		}

		closeModal(){
			jQuery('form').find('input[type=text], input[type=password], input[type=number], input[type=email], textarea').val('');
			this.errors = {};
			this.reset_password=null;
		}

		gotoResetPwd(){
			var closesinBtn = <HTMLElement>document.getElementById("loginModal");
			console.log(closesinBtn);
			jQuery('#closeLoginModal').click();
			this.reset_password=null;
			this.errors = {};
			this.router.navigate(['/forget-password']);
		}


		userSocialLogin(fbUserInfo){
			var ref = this;
			ref.loadingSvc.setValue(true);
			ref.apiService.socialLogin(fbUserInfo,function(res){
				// ref.toastyService.success(res.message);
				ref.loadingSvc.setValue(false);
				if(res.data.token){
					ref.router.navigate(['/index']);
					ref.apiService.signinSuccess$.emit(true);
				}
				var closeBtn = <HTMLElement>document.getElementById("closeSignupModal");
				closeBtn.click();

			},function(error){
				ref.loadingSvc.setValue(false);
				ref.toastyService.error(error.json().message);

				
				
			});
		}

		// userSocialLogin(fbUserInfo){
			// 	var ref = this;
			// 	ref.loadingSvc.setValue(true);
			// 	ref.apiService.socialLogin(fbUserInfo,function(res){
				// 		ref.toastyService.success(res.message);
				// 		ref.loadingSvc.setValue(false);
				// 		if(res.data.token){
					// 			var closeBtn = <HTMLElement>document.getElementById("closeSignupModal");
					// 			closeBtn.click();
					// 			ref.apiService.userProfile(function(res){
						// 				ref.apiService.signinSuccess$.emit(true);						
						// 			}, function(error){
							// 				ref.loadingSvc.setValue(false);
							// 			});
							// 			if(ref.router.url=='/'){
								// 				ref.router.navigate(['/index']);
								// 			}
								// 			else{
									// 				ref.router.navigate(['/']);
									// 			}

									// 		}
									// 	},function(error){
										// 		console.log(error);
										// 	});
										// }




										search(value){

											if(value!=''){		
												this.router.navigate(['/search',value]);
											}
										}






										secondmenuDeafault(){
											var ref = this;
											this.apiService.SecondMenuApi(function(res){
												ref.menuArr = res.data;
											});
										}

										submenuClick(menu,index){
											window.scrollTo(0,0);
											var ref= this;
											var data = ref.apiService.getIndexFunc();
											data.indexSelection(index);
											this.router.navigate(['/event',menu]);
										}


										blogCategory(){
											var ref = this;
											this.apiService.BlogCategoryApi(function(res){
												ref.blogArr = res.data;
											});
										}

										blogCategoryClick(menu,index){
											console.log(menu);	
											this.router.navigate(['/blog',menu]);
										}

										subscribeEmail(details:any):void{
											var ref = this;
											var value = details.value;
											ref.loadingSvc.setValue(true);
											ref.apiService.userSubscription(value,function(res){
												ref.toastyService.success(res.message);
												ref.loadingSvc.setValue(false);
												details.reset();
											},function(error){
												ref.loadingSvc.setValue(false);
												ref.toastyService.error(error.json().message);
												var errors = error.json().errors;
												ref.suberror = errors;
											})

										}



									}