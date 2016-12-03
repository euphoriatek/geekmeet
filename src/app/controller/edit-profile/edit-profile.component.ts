import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
// import  Select2Component  from 'angular2-select2';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-edit-profile',
  templateUrl: '../../view/edit-profile/edit-profile.component.html',
  styleUrls: ['../../assets/css/edit-profile/edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	getToken:any;
  userInfoArr:Object = {};

  constructor(private router: Router,public apiService:ApiMethodService) { }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
      this.userInformation();  
  }


  userInformation(){
    var ref = this;
    ref.apiService.userProfile(function(res){
      ref.userInfoArr = res.data;
      console.log(ref.userInfoArr);
    }, function(err){
      console.log(err);
    });
  }


  updateUserProfile(value:any):void{
    console.log("this is update of user profile");
    console.log(value);
  }

}
