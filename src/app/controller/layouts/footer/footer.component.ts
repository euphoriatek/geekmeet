import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../../model/api-method.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from 'angular2-modal';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Component({
	selector: 'app-footer',
	templateUrl: '../../../view/layouts/footer/footer.component.html',
	styleUrls: ['../../../assets/css/layouts/footer/footer.component.css'
	]
})
export class FooterComponent implements OnInit {


	constructor(private router:Router, public apiService:ApiMethodService,overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) { 
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

				// window.location.reload();
			}
		});
	}

	onSubmitClicck(){
		this.router.navigate(['/']);
	}
	

	userSignUp(value:any):void{

		var refreg = this;
		this.apiService.userRegistrationApi(value,function(res){
			console.log("this is api response"+ JSON.stringify(res));
			window.location.reload();
		});
	}

	onClickButton() {
		this.modal.alert()
		.title('Hello World')
		.body(`#tmpl_login_frm`)
		.open();
	}


}

