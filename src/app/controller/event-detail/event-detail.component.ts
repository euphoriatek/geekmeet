import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import {RatingModule} from "ng2-rating";
import {CKEditorModule} from 'ng2-ckeditor';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { LoadingAnimateService } from 'ng2-loading-animate';


declare var jQuery: any;
declare var gapi;

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
  sub_reply_box:Object = {};
  edit_reply_box:Object = {};
  sub_errors:Object = {};
  deleteID:any;
  deleteType:any;
  page:any=1;
  showData:any;
  private promise: Promise<string>;

  
  private clientID = '417186839635-gpfuh48dia4jh670s7d22sbc8pl918g5.apps.googleusercontent.com'  
  private userEmail = "prateek.j1991@gmail.com"; //your calendar Id  
  private userTimeZone = "London";  
  private scope = "https://www.googleapis.com/auth/calendar";



  constructor(private loadingSvc: LoadingAnimateService,private toastyService:ToastyService, private toastyConfig: ToastyConfig,private route: ActivatedRoute,private apiService: ApiMethodService,private router: Router) {
    this.toastyConfig.theme = 'bootstrap';
  }


  ngOnInit() {
    this.getToken = this.apiService.getLoginToken();
    if(this.getToken){
      this.isUserLoggedIn = true;
    }
    this.route.params.subscribe(params => {
      this.data['popular_event']={};
      this.data['event_data']={};
      this.data['review']={};

      this.selectedData = params['id'];
      this.event_id = params['id'];
      this.getEventDetail(params['id']);
      this.popularEvent();
      this.getReview(params['id']);
      this.userInformation();
      this.addEventVisit(this.selectedData);
    });

    
  }

  ngAfterViewInit() {
    setTimeout(_ => {
      jQuery(document).find('.flexslider').flexslider({
        animation: "slide",
        smoothHeight: true, 
        animationLoop: false,
        start: function (slider) {
          jQuery('.event_detail_module').removeClass('loading');
        }
      });

    }, 1000);

  }

  getEventDetail(value){
    var refreg = this;

    refreg.loadingSvc.setValue(true);
    this.apiService.EventDetail(value,function(res){

      refreg.loadingSvc.setValue(false);
      if(typeof(refreg.data)=='undefined'){
        refreg.data = {};
      }
      refreg.data['event_data'] = res.data;
      refreg.data['relate_event_data'] = res.data.related_event.data;   
    });
  }
  gotoPage(id){
    this.router.navigate(['/event_detail/'+id]);   
  }

  popularEvent(){
    var ref = this;

    var value = {
      'category': '',
      'sort':'',
      'all':false,
      'page':ref.page
    }
    this.apiService.popularEventApi(value,function(res){
      if(typeof(ref.data)=='undefined'){
        ref.data = {};
        ref.showData = "No Data Found.!"
      }
      
      ref.data['popular_event'] = {
        popularArr : res.data.data,
        popularTotal : res.data.last_page,
        currentPage : res.data.current_page,     
      };

    },function(error){

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
        var review_index = res.data.review[i]; 
        ref.reply_box[review_index.event_review_id] = false; 
        ref.edit_box[review_index.event_review_id] = false; 
        ref.errors[review_index.event_review_id] = false;

        for(var j=0;j<(review_index.reply.length);j++){
          if(ref.sub_reply_box[review_index.event_review_id]==undefined){
            ref.sub_reply_box[review_index.event_review_id] = {}; 
          } 
          if(ref.edit_reply_box[review_index.event_review_id]==undefined){
            ref.edit_reply_box[review_index.event_review_id] = {}; 
          } 
          if(ref.sub_errors[review_index.event_review_id]==undefined){
            ref.sub_errors[review_index.event_review_id] = {}; 
          } 
          ref.sub_reply_box[review_index.event_review_id][review_index.reply[j].review_reply_id] = false; 
          ref.edit_reply_box[review_index.event_review_id][review_index.reply[j].review_reply_id] = false; 
          ref.sub_errors[review_index.event_review_id][review_index.reply[j].review_reply_id] = false;
        } 
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
    this.page = ev_id;
    this.popularEvent();
  }

  addReview(addComment:any):void{
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.getReview(this.selectedData);
    }else{
      var value = addComment.value;
      value.event_id = this.event_id;
      var refreg = this;
      refreg.loadingSvc.setValue(true);
      refreg.apiService.addReview(value,function(res){
        refreg.loadingSvc.setValue(false);
        refreg.getReview(refreg.event_id);
        addComment.reset();

      },function(error){
        refreg.loadingSvc.setValue(false);
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


  addReply(value:any,review_id:any,reply_id):void{
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
        if(reply_id!=false){
          refreg.sub_errors[review_id][reply_id] = error;
        }else{
          refreg.errors[review_id] = error;
        }

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



  editReply(value:any, review_reply_id:any,review_id):void{
    this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.getReview(this.selectedData);
    }else{
      var input = {
        reply:value, 
        review_reply_id:review_reply_id
      };

      var refreg = this;
      refreg.apiService.editReply(input,function(res){
        refreg.getReview(refreg.event_id);
      },function(error){
        if(error.status == 401 || error.status == '401' || error.status == 400){
          localStorage.removeItem('auth_token');        
          refreg.apiService.signinSuccess$.emit(false);
          refreg.router.navigate(['/index']);
        }
        var error = error.json().errors;
        refreg.sub_errors[review_id][review_reply_id] = error;
      });
    }
  }

  ShowHideBox(review_event_id){
    this.reply_box[review_event_id] = !this.reply_box[review_event_id];
    if(this.reply_box[review_event_id]){
      this.edit_box[review_event_id] = false;  
    }
  }

  ShowHideEditBox(review_event_id){
    this.edit_box[review_event_id] = !this.edit_box[review_event_id];
    if(this.edit_box[review_event_id]){
      this.reply_box[review_event_id] = false;  
    }
  }

  ShowHideReplyBox(review_event_id,reply_id){
    this.sub_reply_box[review_event_id][reply_id] = !this.sub_reply_box[review_event_id][reply_id];
    if(this.sub_reply_box[review_event_id][reply_id]){
      this.edit_reply_box[review_event_id][reply_id] = false;  
    }
  }

  ShowHideReplyEditBox(review_event_id,reply_id){
    this.edit_reply_box[review_event_id][reply_id] = !this.edit_reply_box[review_event_id][reply_id];
    if(this.edit_reply_box[review_event_id][reply_id]){
      this.sub_reply_box[review_event_id][reply_id] = false;  
    }
  }


  userInformation(){

    if(this.getToken){
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
  setDeleteID(id,type){
    this.deleteID = id;
    this.deleteType = type;
  }


  delete(){
    var ref = this;
    var value = {
      'delete_id':ref.deleteID,
      'type':ref.deleteType
    };
    
    this.apiService.commentDelete(value,function(res){
      ref.getReview(ref.event_id);
    },function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
      }
    });
  }


  addEventVisit(event_id){

    var value = {
      'event_id':this.event_id,
      'visit_count':1,
    }
    var refreg = this;
    refreg.apiService.addVisit(value,function(res){

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

  addFavorite(event_id,favorite){
    var ref = this;  
    var value = {
      'event_id':event_id,
      'favorite':favorite
    }

    ref.apiService.favoriteApi(value,function(res){
      ref.getEventDetail(event_id);  
    });

    
  }

  sendFriend(sendFriendForm:any):void{
    var refreg = this;
    var value = sendFriendForm.value;
    refreg.loadingSvc.setValue(true);  
    value.event_id = this.event_id;
    refreg.apiService.sendToFriend(value,function(res){
      refreg.loadingSvc.setValue(false);
      refreg.toastyService.success(res.message);
      var closeBtn = <HTMLElement>document.getElementById("send_btn_close");
      closeBtn.click();
      sendFriendForm.reset();
    },function(error){
      refreg.loadingSvc.setValue(false);
      refreg.toastyService.error(error.json().message);
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        refreg.apiService.signinSuccess$.emit(false);
        refreg.router.navigate(['/index']);
      }
      var error = error.json().errors;
      refreg.errors = error;
    });

  }

  attendEvent(){
    var value = {
      'event_id':this.event_id,
    }
    var refreg = this;
    refreg.apiService.addAttendence(value,function(res){
      refreg.getEventDetail(refreg.event_id);    
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

  addCalender() {  
    gapi.auth.authorize({client_id: this.clientID, scope: this.scope, immediate: false}, this.handleAuthResult.bind(this));
    return false;
  }

  handleAuthResult(authResult) {  
    console.log("Authentication result:");
    console.log(authResult);
    var ref = this;   
    var event_data =  ref.data['event_data'];

    var promise:Promise<string> = new Promise((resolve, reject) => {
      if (authResult  && !authResult.error) {

        gapi.client.load('calendar', 'v3', function () {

          var today = new Date();

          var request = gapi.client.calendar.events.insert({
            "calendarId":"primary",
            "summary": event_data.event_title,
            "description": event_data.event_description,
            "start": {
              "dateTime": event_data.start_datetime
            },
            "end": {
              "dateTime": event_data.end_datetime
            },
            "creator": {
              "displayName": event_data.first_name +' '+event_data.last_name
            },
            "organizer": {
              "displayName": event_data.organizer
            },
            "location": event_data.location,
            "htmlLink": event_data.website,
            "reminders": {
              "useDefault": false,
              "overrides": [
              {
                "method": "email",
                "minutes": 1440
              },
              {
                "method": "popup",
                "minutes": 10
              }
              ]
            },

          });
          request.execute(function (resp) {

            if(resp.error) {
              reject('Event could not add to your google calender something went wrong');

            }else{
             
              resolve('Event add to your google calender');
            }
          }.bind(this));

        }.bind(this));

      } else  {
          reject(authResult.error);
      }
    });

    promise.then(result =>{
      setTimeout(function(){
        console.log(ref);
        ref.toastyService.success(result);
       },1000);
      
    },err=>{
      ref.toastyService.error(err);
    });


  }
}

