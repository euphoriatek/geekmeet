import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiMethodService } from '../../../model/api-method.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-header',
  templateUrl: '../../../view/layouts/header/header.component.html',
  styleUrls: ['../../../assets/css/layouts/header/header.component.css'
  ]
})
export class HeaderComponent implements OnInit {
  getToken:any;
  menuArr:any;
  isUserLoggedIn:any = false;
  // @Output() onSubMenuChange = new EventEmitter<string>();


  constructor(private router: Router, public apiService:ApiMethodService,public toastyService:ToastyService,private toastyConfig: ToastyConfig) {
    this.toastyConfig.theme = 'bootstrap';
    this.getToken = this.apiService.getLoginToken();
    if(this.getToken){
      this.isUserLoggedIn = true;
    }
    apiService.signinSuccess$.subscribe(status => {
      if(status) {
        this.getToken = this.apiService.getLoginToken();
        if(this.getToken){
          this.isUserLoggedIn = true;
        }
      }
      else{
        this.getToken = '';
      }
    });


    
  }

  ngOnInit() {
    this.secondmenuDeafault();
  }

  goToBlog(){
    this.router.navigate(['/blog']);
  }

  userLogout(){
    var ref = this;
    ref.apiService.userLogoutApi(function(res){
      ref.getToken="";
      ref.isUserLoggedIn = false;
      console.log("this is api response"+ JSON.stringify(res));
      ref.toastyService.success(res.message);
      if(ref.router.url=='/index'){
        ref.router.navigate(['/']);       
      }
      else{
        ref.router.navigate(['/index']);
      } 
      
    });
  }

  secondmenuDeafault(){
    var ref = this;
    this.apiService.SecondMenuApi(function(res){
      ref.menuArr = res.data;
    });
  }

  submenuClick(menu,index){
    this.router.navigate(['/event',menu]);
  }
}
