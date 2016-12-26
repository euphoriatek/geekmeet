import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-search',
  templateUrl: '../../view/search/search.component.html',
  styleUrls: ['../../assets/css/search/search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute,public apiService:ApiMethodService,private toastyService:ToastyService,private toastyConfig: ToastyConfig) { }

  ngOnInit() {
  }

}
