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
  previous:any;

 
   constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,private apiService: ApiMethodService) {

   }
  
  ngOnInit() {
  	
      this.route.params.subscribe(params => {
      this.getBlogDetail(params['id']);
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
    });
  }

  disabled_function(value){
   return value==null;

  }



}


	
		
