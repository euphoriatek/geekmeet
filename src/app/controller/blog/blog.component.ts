import { Component, OnInit } from '@angular/core';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoadingAnimateService } from 'ng2-loading-animate';


@Component({
  selector: 'app-blog',
  templateUrl: '../../view/blog/blog.component.html',
  styleUrls: ['../../assets/css/blog/blog.component.css']
})
export class BlogComponent implements OnInit {
	blogArr:any;
	blogTotal:any;
	currentPage:any;
  category:any='';
  page:any = 1;
  empty_data:any =false;

	constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute, public apiService:ApiMethodService) { }

  ngOnInit() {
  
    this.route.params.subscribe((param) => {
  
       if(param['category']!=undefined){
          this.category = param['category'];
           this.blogDeafault();

       }else{
         this.blogDeafault(); 
       }
      });
     
     
  }

  blogDeafault(){
		var ref = this;
    var category = this.category;
    var page = this.page;
    var value={
    "category":category,
    "page":page  
    } 
    ref.loadingSvc.setValue(true);
		this.apiService.blogApi(value,function(res){
            window.scrollTo(0,0);
            ref.loadingSvc.setValue(false);
            ref.blogArr = res.data.data;
            ref.blogTotal = res.data.last_page;
            ref.currentPage = res.data.current_page;
       ref.empty_data = false;
       if(res.data.data.length<1){
         ref.empty_data = true;
      }
    
			   			
		});

    
	}

	 createRange(number){
    var links = [];
    for(var i = 1; i <= number; i++){
      links.push(i);
    }
    
    return links;
  }

    getBlogPagination(ev_id){
    this.page = ev_id;
    this.blogDeafault();
  }

}
