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
   showData:any;

  constructor(private loadingSvc: LoadingAnimateService,private toastyService:ToastyService, private toastyConfig: ToastyConfig,private route: ActivatedRoute,private apiService: ApiMethodService,private router: Router) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
      this.text = params['id'];
      this.search(this.text);      
    });
  }

  goToEventDetail(id,title){
    this.apiService.setEventDetailId(id);
    var newIndex = this.apiService.getUrlString(title);
    this.router.navigate(['/event-detail',newIndex]);
  }

  goToBlogDetail(id,title){
    this.apiService.setBlogDetailId(id);
    var newIndex = this.apiService.getUrlString(title);
    this.router.navigate(['/blog-detail',newIndex]);
  }


    search(text){
    var refreg = this;
    refreg.loadingSvc.setValue(true);
    var value = {
    'search':text	
    }

    this.apiService.searchData(value,function(res){
    
      refreg.loadingSvc.setValue(false);
      if(res.data.event.length<1 && res.data.blog.length<1 && res.data.organization.length<1 && res.data.venue.length<1){
        refreg.empty = true;
      }
      else{
        refreg.empty = false;
        refreg.event = res.data.event;
        refreg.blog =  res.data.blog;
        refreg.organization =  res.data.organization;
        refreg.venue =  res.data.venue;  
      }

      // if(res.data.event.length<1){
      // refreg.empty = true;
      // }else{
      // refreg.event = res.data.event;  
      // refreg.empty = false;	
      // }

      // if(res.data.blog.length<1){
      // refreg.blog =  true;
      // }else{
      // refreg.blog =  res.data.blog;  
      // refreg.empty = false;	
      // }

      // if(res.data.organization.length<1){
      // refreg.empty = true;
      // }else{
      //  refreg.organization =  res.data.organization;  
      // refreg.empty = false;  
     	
      // }

      // if(res.data.venue.length<1){
      //  refreg.empty = true;  
      // }else{
      // refreg.venue =  res.data.venue;  
      // refreg.empty = false;	
      // }
      
   
    },function(error){
       refreg.loadingSvc.setValue(false);
      refreg.empty = true;  
    });

  }

}
