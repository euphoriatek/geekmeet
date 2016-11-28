import { Injectable } from '@angular/core';
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

	constructor(private http: Http) {
		this.loggedIn = !!localStorage.getItem('auth_token');
	}

	getLoginToken(){
		return localStorage.getItem('auth_token');
	}

	isLoggedIn() {
		return this.loggedIn;
	}


	//this is user login api

	userLoginApi(params,callBack,error){
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
		}, (error) => console.log("Invalid Credentials or Account is Deactive.!"));
	}


	// this is user registration api


	userRegistrationApi(regData, callBack){
		this.http.post('http://2016.geekmeet.com/admin/v1/registration', regData).map(res =>res.json())
		.subscribe((res) => {
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
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

	blogApi(callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/blog').map(res=>res.json())
		.subscribe((res)=>{
			if(callBack)
			{
				callBack(res);
			}
		}, (error) => console.log('There was an error', error));
	}

	

	//this is event api

	eventApi(callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/event').map(res=>res.json())
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

	popularEventApi(callBack){
		this.http.get('http://2016.geekmeet.com/admin/v1/popular_event').map(res=>res.json())
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



}
