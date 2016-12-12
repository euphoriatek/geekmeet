import { Injectable , EventEmitter } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
// import {localStorage} from 'localStorage';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiMethodService {
	loginToken:any;
	getTokenValue:any;
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
		}, (error) => failure(error));;
	}


	// this is user logout api

	userLogoutApi(callBack){
		let headers = new Headers({ 'Auth': "Bearer "+ localStorage.getItem('auth_token')});
		let options = new RequestOptions({ headers: headers });
		this.http.get('http://2016.geekmeet.com/admin/v1/logout', options).map(res=>res.json())
		.subscribe((res)=>{
			if(res.status == "success"){
				this.getTokenValue = "";
				localStorage.removeItem('auth_token');
				this.loggedIn = false;
			}
			if(callBack){
				callBack(res);
			}
		}, (error)=>console.log('there was an error',error));
	}



	//this is blog api when user not logged in

	blogApi(regdata,callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/blog?page='+regdata).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	

	//this is event api

	eventApi(eventData,callBack){
		var page = eventData.page;
		if(page==undefined){
			page = 1;
		}
		this.http.post('http://2016.geekmeet.com/admin/v1/event?page='+page,eventData).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
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

	popularEventApi(regdata,callBack){
		
		this.http.get('http://2016.geekmeet.com/admin/v1/popular_event?page='+regdata).map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));	

	}

	// 

	// get upcoming event api list

	upcomingEventApi(callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/upcoming_event').map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	//

	// get upcoming event api list

	EventDetail(regData,callBack){
		
		this.http.get('http://2016.geekmeet.com/admin/v1/event_detail/'+regData).map(res =>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
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


	// edit reply

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

}



