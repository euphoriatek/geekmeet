import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-organization',
  templateUrl: '../../view/organization/organization.component.html',
  styleUrls: ['../../assets/css/organization/organization.component.css']
})
export class OrganizationComponent implements OnInit {
	getToken:any; 
  detailArr:Object = {};
  eventArr:any;
  selectedmenu:any;
  sortvalData:any;
  selectedIndex = -1;
  gridview=true;
  param_id:any;

  constructor(private router: Router,private route: ActivatedRoute,public apiService:ApiMethodService) { }

  ngOnInit() {
  	this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}

     this.route.params.subscribe(params => {
      this.organizationDetail(params['id']);
      });

   // this.organizationDetail();  
    this.eventDefault();
  }

    organizationDetail(value){
    var ref = this;
    ref.apiService.organization_detail(value,function(res){     
      ref.detailArr = res.data;
    }, function(err){
      console.log(err);
    });
  }

  eventDefault(){
    var ref = this;
    var eventArrData = {
      "category": "",
      "type": "",
      "sort":"",
      "all": "true"
    }
    ref.apiService.eventApi(eventArrData,function(res){
      ref.eventArr = res.data;
      console.log("this is event api response"+ JSON.stringify(res));      
    });
  }

  onSubMenuchange(event){
    var ref = this;
    ref.selectedIndex = -1;
    var eventArrData = {
      "category": event,
      "type": "",
      "sort":"",
      "all": "false"
    }
    ref.apiService.eventApi(eventArrData,function(res){
      ref.eventArr = res.data.data;
    });
  }

  sortEventsData(sortVal){
    var ref = this;
    console.log(ref.param_id);
    var eventArrData = {
      "category": ref.param_id,
      "type": "",
      "sort":sortVal,
      "all": "false"
    }
    ref.apiService.eventApi(eventArrData,function(res){
      ref.eventArr = res.data.data;
    });
  }

  typeOfEvent(event,index){
    var ref = this;
    console.log("this is type event"+event);
    this.selectedIndex = index;
    var eventArrData = {
      "category": ref.param_id,
      "type": event,
      "sort":"",
      "all": "false"
    }
    ref.apiService.eventApi(eventArrData,function(res){
      ref.eventArr = res.data.data;
    });
  }

  changeGridTolist(status){
    this.gridview = status;
  }

}
