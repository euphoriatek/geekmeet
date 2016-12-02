import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-event',
  templateUrl: '../../view/event/event.component.html',
  styleUrls: ['../../assets/css/event/event.component.css']
})
export class EventComponent implements OnInit {
  eventArr:any;
  selectedmenu:any;
  sortvalData:any;
  selectedIndex = -1;
  gridview=true;
  param_id:any;

  constructor(private router:Router,private route: ActivatedRoute, public apiService:ApiMethodService) { }

  ngOnInit() {
    if(this.router.url === '/event'){
      this.eventDeafault();
    }
    this.selectedmenu = this.route.snapshot.params['menu'];
    this.route.params.subscribe((param) => {
      this.param_id = param['menu'];
      console.log(JSON.stringify(param));
      this.onSubMenuchange(param['menu']);
    })
  }

  eventDeafault(){
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
