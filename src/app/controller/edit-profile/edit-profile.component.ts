import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router }   from '@angular/router';
// import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
// import * as moment from 'moment';
// import { DatePickerIonicComponent } from 'ng2-datepicker';
// import { Select2Component } from 'ng2-select2/ng2-select';
// import {Select2OptionData} from 'ng2-select2/ng2-select2';
// import  Select2Component  from 'angular2-select2';
declare var jQuery: any;

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
  topic:any;
  value:any;
  private selectedDateNormal:string = '';

  private selectedTextNormal: string = '';
  private border: string = 'none';
  private myDatePickerNormalOptions = { selectionTxtFontSize: '14px'};

  constructor(private router: Router,public apiService:ApiMethodService) { }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
    this.userInformation();  
  }

  ngAfterViewInit() {
    jQuery(document).find("#multiple").select2({
      width: '100%',
      start: function (select2) {
        jQuery('.edit_profile__module').removeClass('loading');
      }
    });

  }



  userInformation(){
    var ref = this;
    ref.apiService.userProfile(function(res){
      ref.userInfoArr = res.data;
      console.log(ref.userInfoArr);
      ref.selectedDateNormal = res.data.dob;
    }, function(err){
      console.log(err);
    });
  }

  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }


  public itemsToString(value:Array<any> = []):string {
    return value
    .map((item:any) => {
      return item.text;
    }).join(',');
  }



  onDateChanged(event:any) {
    console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    if(event.formatted !== '') {
      this.selectedTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
      this.border = '1px solid #CCC';

      this.selectedDateNormal = event.formatted;
    }
    else {
      this.selectedTextNormal = '';
      this.border = 'none';
    }
  }


  updateUserProfile(value:any):void{
    console.log("this is update of user profile");
    console.log(value);
    // this.apiService.updateUser(value,function(res){
    //   console.log(res);
    // },function(err){
    //   console.log(err);
    // });
  }



}
