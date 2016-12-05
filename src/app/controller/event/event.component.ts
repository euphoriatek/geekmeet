import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
declare var jQuery: any;

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

   ngAfterViewInit() {
    //to initiate sort dropdown on first view load
    

       setTimeout(_ => {
      
      jQuery(".sort_options select,#searchform select,#submit_form select,.search_filter select,.tmpl_search_property select,.widget_location_nav select,#srchevent select,#header_location .location_nav select,.horizontal_location_nav select,.widget select").not("#tevolution_location_map select").each(function() {
        if (0 == jQuery(this).parent().find(".select-wrap").length && "js-cat-basic-multiple select2-hidden-accessible" != jQuery(this).prop("className") && "js-sub-cat-basic-multiple select2-hidden-accessible" != jQuery(this).prop("className")) {
            jQuery(this).wrap("<div class='select-wrap'></div>");
            jQuery(".peoplelisting li").wrapInner("<div class='peopleinfo-wrap'></div>");
        }
        var a = jQuery(this).attr("title");
        if ("multiple" != jQuery(this).attr("multiple")) {
            var a = jQuery("option:selected", this).text();
            jQuery(this).css({
                "z-index": 10,
                opacity: 0,
                "-khtml-appearance": "none"
            }).after('<span class="select">' + a + "</span>").change(function() {
                var val = jQuery("option:selected", this).text();
                jQuery(this).next().text(val);
            });
        }
    });
     
    }, 1000);
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
