import { Component, OnInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-blog-detail',
  templateUrl: '../../view/blog-detail/blog-detail.component.html',
  styleUrls: ['../../assets/css/blog-detail/blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  selectedData:any;
  constructor(private route: ActivatedRoute,private heroService: ApiMethodService) {

   }

  ngOnInit() {
  		this.selectedData = this.route.params.subscribe(v => console.log("this is data"+JSON.stringify(v)));
  		
  }

}


	
		
