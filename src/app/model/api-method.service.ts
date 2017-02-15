import { Injectable , EventEmitter } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
// import {localStorage} from 'localStorage';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiMethodService {
	loginToken:any;
	getIndex:any;
	getTokenValue:any;
	getRef:any;
	getEventAddIndex:any;
	footerref:any;
	private storage: any;
	private loggedIn = false;
	public signinSuccess$: EventEmitter<boolean>;

	constructor(private http: Http) {
		this.loggedIn = !!localStorage.getItem('auth_token');
		this.signinSuccess$ = new EventEmitter();
		

	}

	getLoginToken(){
		return localStorage.getItem('auth_token');
	}

	isLoggedIn() {
		return this.loggedIn;
	}
	testFunction(index){
		this.getIndex = index;
	}
	getIndexFunc(){
		return this.getIndex;

	}

	setHeaderRef(headerRef){
		this.getRef = headerRef;
	}

	getHeaderRef(){
		return this.getRef;
	}

	setFooterRef(ref){
		this.footerref = ref;
	}

	getFooterRef(){
		return this.footerref;
	}
	setEventAdd(index){
		this.getEventAddIndex = index;
	}
	getEventAdd(){
		return this.getEventAddIndex;
	}

	setEventDetailId(id){
		localStorage.setItem('eventDetailID', id);
	}
	getEventDetailId(){
		return localStorage.getItem('eventDetailID');
	}

	getUrlString(string){
		var newOne = string.replace(/^\s*|\s*$|[^\w\s]/gi, '');
		var newIndex = newOne.replace(/ +/g, '-');
		return newIndex;
	}

	setBlogDetailId(id){
		localStorage.setItem('blogDetailID', id);
	}

	getBlogDetailId(){
		return localStorage.getItem('blogDetailID');
	}




	//this is user login api




	userLoginApi(params, callBack, failure){

		this.http.post('http://2016.geekmeet.com/admin/v1/login', params).map(res =>res.json())
		.subscribe((res) => {
			localStorage.setItem('auth_token', res.data.token);
			this.getTokenValue = localStorage.getItem('auth_token');
			if(res.data.token){
				this.loggedIn = true;
			}
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}


	// this is user registration api


	userRegistrationApi(regData, callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/registration', regData).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}


	// this is user logout api

	userLogoutApi(callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/logout', options).map(res=>res.json())
		.subscribe((res)=>{
			if(res.status == "success"){
				this.getTokenValue = "";
				localStorage.removeItem('auth_token');
				localStorage.removeItem('user_name');
				this.loggedIn = false;
			}
			if(callBack){
				callBack(res);
			}
		}, (error) => failure(error));
	}



	//this is blog api when user not logged in

	blogApi(regdata,callBack){
		var page = regdata.page;
		this.http.post('http://2016.geekmeet.com/admin/v1/blog?page='+page,regdata).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	// blog category 

	BlogCategoryApi(callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/blog_category').map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	

	//this is event api

	eventApi(eventData,callBack,failure){
		var page = eventData.page;
		if(page==undefined){
			page = 1;
		}
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		if(localStorage.getItem('auth_token')!=null){
			let options = new RequestOptions({ headers: headers });	
			this.http.post('http://2016.geekmeet.com/admin/v1/detailed_event?page='+page,eventData,options).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					
					callBack(res);
				}
			}, (error) => failure(error));
		}else{
			this.http.post('http://2016.geekmeet.com/admin/v1/event?page='+page,eventData).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					
					callBack(res);
				}
			}, (error) => failure(error));

		}
		
	}

	//this is event category api

	SecondMenuApi(callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/event_category').map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	// get popular event api list

	popularEventApi(regdata,callBack,failure){
		var page = regdata.page;
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		if(localStorage.getItem('auth_token')!=null){
			let options = new RequestOptions({ headers: headers });	
			this.http.post('http://2016.geekmeet.com/admin/v1/detailed_popular_event?page='+page,regdata,options).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => console.log('There was an error', error));
		}else{
			this.http.post('http://2016.geekmeet.com/admin/v1/popular_event?page='+page,regdata).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));

		}	

	}


	

	// 

	// get upcoming event api list

	upcomingEventApi(value,callBack,failure){
		var page = value.page;
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		if(localStorage.getItem('auth_token')!=null){
			let options = new RequestOptions({ headers: headers });	
			this.http.post('http://2016.geekmeet.com/admin/v1/detailed_upcoming_event?page='+page,value,options).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		}else{
			this.http.post('http://2016.geekmeet.com/admin/v1/upcoming_event?page='+page,value).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));

		}
	}

	//

	// get upcoming event api list

	EventDetail(regData,callBack){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		if(localStorage.getItem('auth_token')!=null){
			let options = new RequestOptions({ headers: headers });	
			this.http.get('http://2016.geekmeet.com/admin/v1/user_event_detail/'+regData,options).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => console.log('There was an error', error));
		}else{
			this.http.get('http://2016.geekmeet.com/admin/v1/event_detail/'+regData).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => console.log('There was an error', error));

		}	
	}
	

	BlogDetail(regData,callBack){
		
		this.http.get('http://2016.geekmeet.com/admin/v1/blog_detail/'+regData).map(res =>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	// get event by category

	EventCategoryApi(regdata,callBack){
		
		this.http.get('http://2016.geekmeet.com/admin/v1/event_by_category/'+regdata).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));	

	}

	GetEventCategory(data){



	}




	//facebook login

	socialLogin(userInfo,callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/social_login',userInfo).map(res =>res.json())
		.subscribe((res) => {
			localStorage.setItem('auth_token', res.data.token);
			this.getTokenValue = localStorage.getItem('auth_token');
			if(res.data.token){
				this.loggedIn = true;
			}
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));



	}


	// user profile

	userProfile(callBack, failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/profile',options).map(res =>res.json())
		.subscribe((res) => {
			localStorage.setItem('user_name', res.data.first_name);
			localStorage.setItem('user_avatar',res.data.image_url);
			if(callBack)
			{
				callBack(res);
			}
		}, (error) =>  { 
			if(error.status == 401 || error.status == '401' || error.status == 400){
				console.log("this is user profile");
				this.getTokenValue = "";
				localStorage.removeItem('auth_token');
				this.loggedIn = false;
				failure(error);
			}
		});
	}



	//update user profile

	updateUser(userData,callBack, failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/update_profile',userData,options).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}

	// organization details

	organizationList(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/organization?page='+value,options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}



	// get country

	countryList(callBack,faliure){
		this.http.get('http://2016.geekmeet.com/admin/v1/country').map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => faliure(error));	

	}


	//get State

	stateList(country_id,callBack,faliure){
		this.http.get('http://2016.geekmeet.com/admin/v1/state/'+country_id).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => faliure(error));	
	}

	//get City

	cityList(state_id,callBack,faliure){
		this.http.get('http://2016.geekmeet.com/admin/v1/city/'+state_id).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => faliure(error));	

	}

	organization_detail(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/organization_detail/'+value,options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}

	// get organization names	
	organizationNames(callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/organization_list',options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	} 

	// get venue names	
	venueNames(callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/venue',options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	} 

	// get category list	
	categoryList(callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/category_list',options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	} 
	
	// edit organization
	editOrganization(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/update_organization',value,options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}  


	// add organization
	addOrganization(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/add_organization',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}


	// delete organization
	organizationDelete(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/delete_organization/'+value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	} 


	// add review
	addReview(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/add_review',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}


	// get review of event

	getReview(event_id,callBack){
		
		this.http.get('http://2016.geekmeet.com/admin/v1/get_review/'+event_id).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));	

	}

	// add reply

	addReply(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/add_reply',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}



	showVenueList(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/venue_list?page='+value,options).map(res =>res.json())
		.subscribe((res)=>{

			if(callBack)
			{
				callBack(res);
			}


		}, (error) => failure(error));
		
	}


	editReview(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/edit_review',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}

	addEvent(userData,callBack, failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/add_event',userData,options).map(res=>res.json())
		.subscribe((res)=>{

			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));

	}


	editReply(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/edit_reply',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	} 


	// delete review and reply
	commentDelete(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/deleteComment',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	} 


	//show venue detail

	showVenueDetails(id,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/venue_detail/'+id,options).map(res=>res.json())
		.subscribe((res)=>{

			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}


	//edit venue

	editVenueDetails(id,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/edit_venue_detail/'+id,options).map(res=>res.json())
		.subscribe((res)=>{

			if(callBack)
			{
				callBack(res);
			}
		}, (error) => failure(error));
	}

	//delete venue
	
	deleteVanue(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/delete_venue/'+value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}



	// add venue

	addVenue(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/add_venue',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}



	//update Venue

	updateVenue(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/update_venue',value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}

	// add visit



	addVisit(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		if(localStorage.getItem('auth_token')!=null){
			let options = new RequestOptions({ headers: headers });
			this.http.post('http://2016.geekmeet.com/admin/v1/user_visit',value,options).map(res =>res.json())
			.subscribe((res) => {
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		}else{
			this.http.post('http://2016.geekmeet.com/admin/v1/add_visit',value).map(res =>res.json())
			.subscribe((res) => {
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		}
	}


	// add or remove fev

	favoriteApi(value,callBack){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/favorite',value,options).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		});
	}




	//change Password

	changePassword(value, callBack, failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/change_password',value,options).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}

	// forgot password
	
	
  	forgotPassword(value, callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/forgot_password',value).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}

	// Check forgot token

	checkForgotToken(value,callBack,failure){
      this.http.get('http://2016.geekmeet.com/admin/v1/checkForgotToken/'+value).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		},(error) =>failure(error));
     }

     // Reset Password

     //change Password

	resetPassword(value, callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/reset_password',value).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}

	contactUs(value, callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/contactUs',value).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}



	eventDelete(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/delete_event/'+value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}

	eventAttendanceDelete(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/delete_event_attendance/'+value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}

	eventEdit(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/edit_event_detail/'+value,options).map(res =>res.json())

		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}

		}, (error) => failure(error));
	}



	//update event

	updateEvent(value, callBack, failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/update_event',value,options).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}


		//send to friend

	sendToFriend(value, callBack, failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.post('http://2016.geekmeet.com/admin/v1/send_friend',value,options).map(res=>res.json())

		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}


	//

		addAttendence(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
			this.http.post('http://2016.geekmeet.com/admin/v1/add_attendance',value,options).map(res =>res.json())
			.subscribe((res) => {
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		
	}


		addCalender(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
			this.http.get('http://2016.geekmeet.com/admin/v1/addCalender/'+value,options).map(res =>res.json())
			.subscribe((res) => {
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		
	}


		printApi(value,callBack,failure){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
			this.http.get('http://2016.geekmeet.com/admin/v1/print/'+value,options).map(res =>res.json())
			.subscribe((res) => {
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		
	}

	searchData(value,callBack,failure){

        let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		if(localStorage.getItem('auth_token')!=null){
			let options = new RequestOptions({ headers: headers });	
			this.http.post('http://2016.geekmeet.com/admin/v1/search_for_user',value,options).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));
		}else{
			this.http.post('http://2016.geekmeet.com/admin/v1/search',value).map(res=>res.json())
			.subscribe((res)=>{
				if(callBack)
				{
					callBack(res);
				}
			}, (error) => failure(error));

		}	
	}


	activateNow(value,token, callBack, failure){
		this.http.get('http://2016.geekmeet.com/admin/v1/activate_account/'+value+'/'+token).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error),);
	}

	userSubscription(value, callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/add_subscriber',value).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}

	getSelectedCity(value, callBack, failure){
		this.http.post('http://2016.geekmeet.com/admin/v1/auto_city',value).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}

	resend_email(value,callBack,failure){
		this.http.get('http://2016.geekmeet.com/admin/v1/resend_mail/'+value).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack){
				callBack(res);
			}
		},(error) =>failure(error));
	}


  }
		






