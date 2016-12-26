import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';

@Component({
  selector: 'app-sponsors',
  templateUrl: '../../view/sponsors/sponsors.component.html',
  styleUrls: ['../../assets/css/sponsors/sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
