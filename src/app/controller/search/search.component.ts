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
   empty:any;

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
      if(res.data.event==[]){
      refreg.empty = true;
      }else{
      refreg.event = res.data.event;  
      refreg.empty = false;	
      }

      if(res.data.blog==[]){
      refreg.blog =  true;
      }else{
      refreg.blog =  res.data.blog;  
      refreg.empty = false;	
      }

      if(res.data.organization==[]){
      refreg.empty = true;
      }else{
       refreg.blog =  res.data.blog;  
      refreg.empty = false;  
     	
      }

      if(res.data.venue==[]){
       refreg.empty = true;  
      }else{
      refreg.venue =  res.data.venue;  
      refreg.empty = false;	
      }
   
    },function(error){
       refreg.loadingSvc.setValue(false);
      refreg.empty = true;  
    });

  }

}
