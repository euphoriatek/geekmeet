import { Component, OnInit } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-blog',
  templateUrl: '../../view/blog/blog.component.html',
  styleUrls: ['../../assets/css/blog/blog.component.css']
})
export class BlogComponent implements OnInit {
	blogArr:any;
	blogTotal:any;
	currentPage:any;

	constructor(private router:Router, public apiService:ApiMethodService) { }

  ngOnInit() {
  	this.blogDeafault(1);

  }

  blogDeafault(value){
		var ref = this;
		this.apiService.blogApi(value,function(res){
			// console.log("this is blog api response"+ JSON.stringify(res.data.data));
			ref.blogArr = res.data.data;
            ref.blogTotal = res.data.last_page;
            ref.currentPage = res.data.current_page;   			
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
    this.blogDeafault(ev_id);
  }

}
