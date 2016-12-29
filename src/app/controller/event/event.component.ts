import { Component, OnInit, AfterViewInit, ViewChild,Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import { EventListComponent } from './eventlist.component';
import { NouisliderModule } from 'ng2-nouislider';
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
  currntRange:any = 300;
  @ViewChild(EventListComponent) event: EventListComponent;
  
    constructor(private toastyService:ToastyService,private toastyConfig: ToastyConfig,private router:Router,private route: ActivatedRoute, public apiService:ApiMethodService) { 
    this.toastyConfig.theme = 'bootstrap';
  }

 
  someRange:any;
  ngOnInit() {   
    jQuery.getScript('//www.ads4mysite.com/adserver/www/delivery/asyncjs.php');
  }

  outputUpdate(range){
    var ref = this;
    ref.currntRange = range;
  }

  searchZipCodeEvent(value:any):void{
    if(value.code){
      this.event.searchByZipCode(value.code);
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
