import { Component, OnInit } from '@angular/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { LoadingAnimateService } from 'ng2-loading-animate';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-activate-now',
  templateUrl: '../../view/activate-now/activate-now.component.html',
  styleUrls: ['../../assets/css/activate-now/activate-now.component.css']
})
export class ActivateNowComponent implements OnInit {
  user_id:any;
  token:any;
  constructor(private loadingSvc: LoadingAnimateService,private router: Router,private route: ActivatedRoute,public apiService:ApiMethodService,private toastyService:ToastyService,private toastyConfig: ToastyConfig) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user_id = params['id'];
      this.token = params['token'];
    });

    this.activateNow(this.user_id,this.token);
  }

  activateNow(id,token){
  	var ref = this;
  	ref.loadingSvc.setValue(true);
    ref.apiService.activateNow(id,token,function(res){ 
      ref.loadingSvc.setValue(false);  
      ref.toastyService.success(res.message);
      var functionRef = ref.apiService.getFooterRef();
      functionRef.openLoginFormForNewUser();
      ref.router.navigate(['/index']);

    }, function(error){
      ref.toastyService.error(error.json().message);
      ref.router.navigate(['/index']);
    });

  }

}
