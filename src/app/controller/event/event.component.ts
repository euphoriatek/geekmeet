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
  selectedIndex = 1;

  constructor(private router:Router,private route: ActivatedRoute, public apiService:ApiMethodService) { }

  ngOnInit() {
    this.selectedmenu = this.route.snapshot.params['menu'];
    this.route.params.subscribe((param) => {
      console.log(JSON.stringify(param));
      this.onSubMenuchange(param['menu']);
    })
  }

  eventDeafault(){
    var ref = this;
    ref.apiService.eventApi(function(res){
      ref.eventArr = res.data;
      console.log("this is event api response"+ JSON.stringify(res));			
    });
  }

  onSubMenuchange(event){
    var ref = this;
    ref.selectedIndex = 1;
    ref.apiService.EventCategoryApi(event,function(res){
      ref.eventArr = res.data.data;
    });
  }

  sortEventsData(sortVal){
    console.log(sortVal);
  }

  pastEvent(index){
    console.log("this is past event"+index);
    this.selectedIndex = index;

  }

  currentEvent(index){
    console.log("this is current event"+index);
    this.selectedIndex = index;
  }

  upcomingEvent(index){
    console.log("this is upcoming event"+index);
    this.selectedIndex = index;
  }


}
