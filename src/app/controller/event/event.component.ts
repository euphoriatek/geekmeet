import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import { EventListComponent } from './eventlist.component';
declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-event',
  templateUrl: '../../view/event/event.component.html',
  styleUrls: ['../../assets/css/event/event.component.css']  
})
export class EventComponent {
 /* eventArr:any;
  selectedmenu:any;
  sortvalData:any;
  selectedIndex = -1;
  gridview=true;
  param_id:any;
  total:any;
  currentPage:any;

  category:any ='';
  type:any = '';
  sort:any ='';
  page:any = 1;


  constructor(private router:Router,private route: ActivatedRoute, public apiService:ApiMethodService) { }

  ngOnInit() {
    if(this.router.url == '/event'){
      this.eventDeafault('','','',1);
    }
    this.selectedmenu = this.route.snapshot.params['menu'];
    this.route.params.subscribe((param) => {
      this.param_id = param['menu'];
      console.log(JSON.stringify(param));
      this.category = param['menu'];
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

    eventDeafault(category,type,sort,page){
    var ref = this;
    this.category = category;
    this.type = type; 
    this.sort = sort;
    this.page = page; 
    var eventArrData = {
      "category": category,
      "type":type,
      "sort":sort,
      "all": "false",
      "page":page
    }
    ref.apiService.eventApi(eventArrData,function(res){
       ref.eventArr = res.data.data;
       ref.total =     res.data.last_page;
       ref.currentPage = res.data.current_page;

    });
  }

  onSubMenuchange(category){
    this.category = category;
    var category = this.category;
    var sort = this.sort;
    var type = this.type;
    var page = this.page;
    this.eventDeafault(category,type,sort,page);  
  }


  sortEventsData(sort){
     this.sort = sort;
    var category = this.category;
    var sort = this.sort;
    var type = this.type;
    var page = this.page;
   this.eventDeafault(category,type,sort,page);
  }

  typeOfEvent(type,index){
    this.selectedIndex = index;
    this.type = type;
    var category = this.category;
    var sort = this.sort;
    var type = this.type;
    var page = this.page;
   this.eventDeafault(category,type,sort,page);
  }

 

  getEventPagination(page){
     this.page = page;
    var category = this.category;
    var sort = this.sort;
    var type = this.type;
    var page = this.page;
   this.eventDeafault(category,type,sort,page);  
  }

   changeGridTolist(status){
    this.gridview = status;
  }*/

  createRange(number){
    var links = [];
    for(var i = 1; i <= number; i++){
      links.push(i);
    }
    
    return links;
  }




}
