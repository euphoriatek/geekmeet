import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
declare var jQuery: any;
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'eventlist',
  templateUrl: '../../view/event/eventlist.component.html',
  styleUrls: ['../../assets/css/event/event.component.css']
})
export class EventListComponent implements OnInit{
  eventArr:any;
  selectedmenu:any;
  sortvalData:any;
  selectedIndex:any = 1;
  gridview=true;
  param_id:any;
  total:any;
  currentPage:any;
  getToken:any;
  category:any ='';
  type:any = '';
  sort:any ='';
  page:any = 1;
  showData:any;
  code:any;


  
  constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,private toastyConfig: ToastyConfig, public apiService:ApiMethodService,private toastyService:ToastyService) { 
    this.toastyConfig.theme = 'bootstrap';
  }

  ngOnInit() {
    // if(this.router.url == '/event'){
      //   this.eventDeafault('','current','',1);
      // }
      this.getToken = this.apiService.getLoginToken();
      this.selectedmenu = this.route.snapshot.params['menu'];
      this.route.params.subscribe((param) => {
        this.param_id = param['menu'];
        this.category = param['menu'];
        this.onSubMenuchange(param['menu'],'current');
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
      var category = this.category;
      var type = this.type; 
      var sort = this.sort;
      var page = this.page;
      var postal_code = this.code;
      console.log(this.selectedIndex);
      var eventArrData = {
        "category": category,
        "type":type,
        "sort":sort,
        "all": "false",
        "page":page,
        "search":postal_code
      }
      ref.loadingSvc.setValue(true);
      ref.apiService.eventApi(eventArrData,function(res){
        ref.loadingSvc.setValue(false);
        ref.eventArr = res.data.data;
        if(ref.eventArr == [] || ref.eventArr == ''){
          ref.showData = "No Data Found.!"
        }
        else{
          ref.showData = '';
        }
        ref.total =  res.data.last_page;
        ref.currentPage = res.data.current_page;
      },function(error){
        ref.loadingSvc.setValue(false);
        ref.toastyService.error(error.json().message);
        if(error.status == 401 || error.status == '401' || error.status == 400){
          localStorage.removeItem('auth_token');        
          ref.apiService.signinSuccess$.emit(false);
          ref.router.navigate(['/index']);
        }
      });
    }

    onSubMenuchange(category,type){
      if(category=='all'){
        this.category ='';
      }else{
        this.category = category;
      }
      this.code='';
      this.eventDeafault();  
    }


    sortEventsData(sort){
      this.sort = sort;
      this.eventDeafault();
    }

    typeOfEvent(type,index){
      this.selectedIndex = index;
      this.type = type;
      this.code='';
      this.eventDeafault();
    }



    getEventPagination(page){
      this.page = page;
      this.eventDeafault();  
    }

    changeGridTolist(status){
      this.gridview = status;
    }

    createRange(number){
      var links = [];
      for(var i = 1; i <= number; i++){
        links.push(i);
      }

      return links;
    }


    searchByZipCode(code){
      var ref = this;
      ref.code = code;
      ref.type = '';
      ref.sort = '';
      ref.selectedIndex = -1;
      ref.eventDeafault();
    }


    addFavorite(event_id,favorite){
      var ref = this;  
      var value = {
        'event_id':event_id,
        'favorite':favorite
      }

      ref.apiService.favoriteApi(value,function(res){
        ref.eventDeafault(); 
      });


    }



  }
