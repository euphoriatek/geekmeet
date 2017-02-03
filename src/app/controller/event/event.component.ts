import { Component, OnInit, AfterViewInit, ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import { EventListComponent } from './eventlist.component';
//import { NouisliderModule } from 'ng2-nouislider';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-event',
  templateUrl: '../../view/event/event.component.html',
  styleUrls: ['../../assets/css/event/event.component.css']  
})
export class EventComponent implements OnInit{
  currntRange:any = 500;
  @ViewChild(EventListComponent) event: EventListComponent;
  // @Output() onEnterZipCode = new EventEmitter<string>();
  
    constructor(private toastyService:ToastyService,private toastyConfig: ToastyConfig,private router:Router,private route: ActivatedRoute, public apiService:ApiMethodService) { 
    this.toastyConfig.theme = 'bootstrap';
  }



  /*getEventPagination(page){
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

  someRange:any;
  showHeader:any;
   getToken:any;
  ngOnInit() {   
    this.getToken = this.apiService.getLoginToken();
    jQuery.getScript('//www.ads4mysite.com/adserver/www/delivery/asyncjs.php');
    this.route.params.subscribe((param) => {
      this.showHeader = param['menu'];
    })
    if(this.showHeader==''){
        this.showHeader ='All';
      }
  }

  outputUpdate(range){
    var ref = this;
    ref.currntRange = range;
  }

  searchZipCodeEvent(zipcodeData){
    var value = zipcodeData.value;
    if(value.code){
      this.event.searchByZipCode(value.code,value.mile);
      // zipcodeData.reset();
      this.showHeader = '';
    }
    else{
      this.toastyService.error("Please Provoide Zipcode.!");
    }
    
  }

  createRange(number){
    var links = [];
    for(var i = 1; i <= number; i++){
      links.push(i);
    }
    
    return links;
  }




}
