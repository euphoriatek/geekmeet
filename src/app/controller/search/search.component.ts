import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { LoadingAnimateService } from 'ng2-loading-animate';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-search',
  templateUrl: '../../view/search/search.component.html',
  styleUrls: ['../../assets/css/search/search.component.css']
})
export class SearchComponent implements OnInit {
   text:any;
   data:any;
   event:Object;
   blog:Object;
   organization:Object;
   venue:Object;
   empty:any = false;

  constructor(private loadingSvc: LoadingAnimateService,private toastyService:ToastyService, private toastyConfig: ToastyConfig,private route: ActivatedRoute,private apiService: ApiMethodService,private router: Router) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {


      this.text = params['id'];
      this.search(this.text);
      
    });
  }


    search(text){
    var refreg = this;
    refreg.loadingSvc.setValue(true);
    var value = {
    'search':text	
    }

    this.apiService.searchData(value,function(res){
      window.scrollTo(0,0);
      refreg.loadingSvc.setValue(false);
      if(res.data.event!=[]){
      refreg.event = res.data.event;
      }else{
      refreg.empty = true;	
      }

      if(res.data.blog!=[]){
      refreg.blog =  res.data.blog;
      }else{
      refreg.empty = true;	
      }

      if(res.data.organization!=[]){
      refreg.organization =  res.data.organization;
      }else{
      refreg.empty = true;	
      }

      if(res.data.venue!=[]){
       refreg.venue =  res.data.venue;  
      }else{
      refreg.empty = true;	
      }

    },function(error){
       refreg.loadingSvc.setValue(false);
      refreg.empty = true;  
    });

  }

}
