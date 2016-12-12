import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import {RatingModule} from "ng2-rating";


declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-event-detail',
  templateUrl: '../../view/event-detail/event-detail.component.html',
  styleUrls: ['../../assets/css/event-detail/event-detail.component.css','../../assets/css/Templatic-Shortcodes/style.css']
})
export class EventDetailComponent implements OnInit {
  eventDetail:any
  selectedData:any;
  getToken:any;
  isUserLoggedIn:any;
  data:Object = {};
  confirmKey = true;
  errors:Object = {};
  event_id:any;
  reply_box:Object = {};
  edit_box:Object = {};
  login_user:Object;


 
  constructor(private route: ActivatedRoute,private apiService: ApiMethodService,private router: Router) {
  }

  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(this.getToken){
      this.isUserLoggedIn = true;
    }
    this.data['popular_event']={};
    this.data['event_data']={};
    this.data['review']={};

    this.selectedData = this.route.snapshot.params['id'];
    this.event_id = this.selectedData;
    this.getEventDetail(this.selectedData);
    this.popularEvent(1);
    this.getReview(this.selectedData);
    this.userInformation();
    
  }

  ngAfterViewInit() {
 
    setTimeout(_ => {
      
        jQuery(document).find('.flexslider').flexslider({
          animation: "slide",
          smoothHeight: true, /* for adjusting height for small images */
          animationLoop: false,
          start: function (slider) {
              jQuery('.event_detail_module').removeClass('loading');
          }
        });
     
    }, 1000);
    
  }

  getEventDetail(value){
 
    var refreg = this;
    this.apiService.EventDetail(value,function(res){
      if(typeof(refreg.data)=='undefined'){
         refreg.data = {};
      }
      refreg.data['event_data'] = res.data;
     
      
    });
  }
  gotoPage(id){
    if(this.confirmKey){
      this.confirmKey = !this.confirmKey;
      this.router.navigate(['/event_details/'+id]); 
    }
    else{
      this.router.navigate(['/event_detail/'+id]); 
    }
    
  }

  popularEvent(value){
    var ref = this;
    this.apiService.popularEventApi(value,function(res){
      if(typeof(ref.data)=='undefined'){
         ref.data = {};
      }
      
       ref.data['popular_event'] = {
        popularArr : res.data.data,
        popularTotal : res.data.last_page,
        currentPage : res.data.current_page,     
      };

    });

  }


  getReview(value){
    var ref = this;
    this.apiService.getReview(value,function(res){
      if(typeof(ref.data)=='undefined'){
         ref.data = {};
      }
      
        ref.data['review'] = {
        review : res.data.review,
        review_count : res.data.review_count
      };

      for(var i=0; i<res.data.review_count;i++){
       ref.reply_box[res.data.review[i].event_review_id] = false; 
       ref.edit_box[res.data.review[i].event_review_id] = false; 
       ref.errors[res.data.review[i].event_review_id] = false; 

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

  getEventPagination(ev_id){
    this.popularEvent(ev_id);
  }

  addReview(addComment:any):void{
      this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.getReview(this.selectedData);
    }else{
    var value = addComment.value;
    value.event_id = this.event_id;
    var refreg = this;
    refreg.apiService.addReview(value,function(res){
       refreg.getReview(refreg.event_id);
       addComment.reset();
       
      },function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        refreg.apiService.signinSuccess$.emit(false);
        refreg.router.navigate(['/index']);
      }
      var error = error.json().errors;
      refreg.errors = error;
    });

    
    }
  }


    addReply(value:any,review_id:any):void{
      this.getToken = this.apiService.getLoginToken();
     if(!(this.getToken)){
      this.getReview(this.selectedData);
    }else{
    var input = {
    reply:value, 
    review_id:review_id
    };
   
    var refreg = this;
    refreg.apiService.addReply(input,function(res){
       refreg.getReview(refreg.event_id);
      },function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        refreg.apiService.signinSuccess$.emit(false);
        refreg.router.navigate(['/index']);
      }
      var error = error.json().errors;
      refreg.errors[review_id] = error;
    });
   }
  }


     editReview(value:any,review_id:any):void{
      this.getToken = this.apiService.getLoginToken();
     if(!(this.getToken)){
      this.getReview(this.selectedData);
    }else{
    var input = {
    event_review:value, 
    review_id:review_id
    };
    
    var refreg = this;
    refreg.apiService.editReview(input,function(res){
       refreg.getReview(refreg.event_id);
      },function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        refreg.apiService.signinSuccess$.emit(false);
        refreg.router.navigate(['/index']);
      }
      var error = error.json().errors;
      refreg.errors[review_id] = error;
    });
   }
  }

  ShowHideBox(review_event_id){
  this.reply_box[review_event_id] = !this.reply_box[review_event_id];
  }

  ShowHideEditBox(review_event_id){
  this.edit_box[review_event_id] = !this.edit_box[review_event_id];
  }


  userInformation(){
    var ref = this;
    ref.apiService.userProfile(function(res){
      // console.log(JSON.stringify(res));
      ref.login_user = res.data.user_id;
      
    }, function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
       ref.login_user = false;
      }
    });
  }


  
}

