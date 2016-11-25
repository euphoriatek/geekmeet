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
	// @Output() isUserLoggedIn = new EventEmitter();
	tokenValueAuth:any;


	constructor(private router: Router, public apiService:ApiMethodService,overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) { 
		overlay.defaultViewContainer = vcRef;
	}

	ngOnInit() {
		// this.isUserLoggedIn.emit({
			// 	value: this.tokenValueAuth
			// })
		}

		resolved(captchaResponse: string) {
			console.log(`Resolved captcha with response ${captchaResponse}:`);
		}


		userSignIn(value:any):void{

			var ref = this;
			this.apiService.userLoginApi(value,function(res){
				console.log("this is api response"+ JSON.stringify(res));

				// ref.loginModalHidden = false;
				// var elem = document.getElementsByClassName('modal-backdrop');			
				// for (var i = elem.length - 1; i >= 0; i--) {
					// 	let element = <HTMLElement>elem[i];
					// 	element.className += " hideModal";
					// }

					if(res.data.token){
						ref.router.navigate(['/index']);
						// ref.router.navigateByUrl('/link1');
					}
					var closeBtn = <HTMLElement>document.getElementById("closeLoginModal");
					closeBtn.click();
				});
		}



		userSignUp(value:any):void{

			var refreg = this;
			this.apiService.userRegistrationApi(value,function(res){
				console.log("this is api response"+ JSON.stringify(res));
				refreg.router.navigate(['/']);
				var closeBtn = <HTMLElement>document.getElementById("closeLoginModal");
				closeBtn.click();
			});
		}

		signupClick(){
			var closeBtn = <HTMLElement>document.getElementById("closeLoginModal");
			closeBtn.click();
		}

		siginClick(){
			var closeBtn = <HTMLElement>document.getElementById("closeSignupModal");
			closeBtn.click();
		}


	}

