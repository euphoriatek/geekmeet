import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { LoadingAnimateService } from 'ng2-loading-animate';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-blog-detail',
  templateUrl: '../../view/blog-detail/blog-detail.component.html',
  styleUrls: ['../../assets/css/blog-detail/blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blogDetail:any = {};
  selectedData:any;
  data:Object;
  next:any;
  blogID:any;
  previous:any;
  nxt_title:any;
  pre_title:any;

 
   constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,private apiService: ApiMethodService) {

   }
  
  ngOnInit(){
      this.route.params.subscribe(params => {
        this.blogID = this.apiService.getBlogDetailId();
        this.getBlogDetail(this.blogID);
      });	
  }

  getBlogDetail(value){
    var refreg = this;
    refreg.loadingSvc.setValue(true);
    this.apiService.BlogDetail(value,function(res){
       window.scrollTo(0,0);
      refreg.loadingSvc.setValue(false);      
     refreg.blogDetail = res.data[0];
     refreg.next = res.next;
     refreg.previous = res.previous;
     refreg.nxt_title = res.next_title;
     refreg.pre_title = res.prev_title;      
    });
  }

  // disabled_function(value){
  //  return value==null;

  // }

  goToBlogDetail(id,title){
    window.scrollTo(0,0);      
    this.apiService.setBlogDetailId(id);
    var newIndex = this.apiService.getUrlString(title);
    this.router.navigate(['/blog-detail',newIndex]);
    this.getBlogDetail(id);
  }



}


	
		
