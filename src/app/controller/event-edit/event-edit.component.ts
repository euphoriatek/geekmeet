import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'ng2-select/ng2-select';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {CKEditorModule} from 'ng2-ckeditor';
import { LoadingAnimateService } from 'ng2-loading-animate';


declare var jQuery: any;

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'app-event-edit',
	templateUrl: '../../view/event-edit/event-edit.component.html',
	styleUrls: ['../../assets/css/event-edit/event-edit.component.css','../../assets/css/eventadd/fileinput.min.css'],
	encapsulation: ViewEncapsulation.None,  
})
export class EventEditComponent implements OnInit {
	defaultCountry:Array<Object>=[];
	defaultState:Array<Object>=[];
	defaultCity:Array<Object>=[];
	defaultOrg:Array<Object>=[];
	defaultVenue:Array<Object>=[];
	errors:Object = {};
	getToken:any;
	userInfoArr:Object = {};
	topic:any;
	value:any;
	countryList:any;
	imageArr:Array<string> = []; 
	countryArr:Array<Object> = [];
	stateList:Array<Object> = [];
	cityList:Array<Object> = [];
	categoryList:any;
	organizationList:Array<Object> = [];
	venueList:Array<Object> = [];
	keywordList:Array<string> = [];
	country: string;
	state: string;
	city: string;
	location: string;
	organizers:string;
	keyword:string;
	audience:string;
	start_time:string;
	end_time:string;
	event_id:any;
	title:any;
	description:any;
	startDate:any;
	endDate:any;
	contact:any;
	selectedData:any;
	showEventArr:Array<string> = [];
	countryId:Array<string> = [];
	stateId:Array<string> = [];
	cityId:Array<string> = [];
	orgId:Array<string> = [];
	imagePreview:any;
	imageLink:any;
	imageId:any;

	private startDateNormal:string = '';
	private startTextNormal: string = '';

	private endDateNormal:string = '';
	private endTextNormal: string = '';

	private border: string = 'none';
	private myDatePickerNormalOptions = { selectionTxtFontSize: '14px'};

	public audienceList:Array<string> = ['Child', 'Youngest', 'Oldest']; 
	// public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

	constructor(private route: ActivatedRoute,private loadingSvc: LoadingAnimateService,private router: Router,public apiService:ApiMethodService,private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}

		// adding script for phone mask
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = "../../app/assets/js/jquery/maskedinput.min.js"; 
		var s1 = document.createElement("script");
		s1.type = "text/javascript";
		s1.src = "../../app/assets/js/jquery/fileinput.min.js";

		jQuery("head").append(s);
		jQuery("head").append(s1);
		this.route.params.subscribe(params => {
			this.selectedData = params['id'];
			this.event_id = params['id'];
			this.getEventDetail(params['id']); 
			this.getVenueList();
			this.getOrganizationList();
			this.getCategoryList();
		});

	}

	getEventDetail(value){
		var refreg = this;
		refreg.loadingSvc.setValue(true);
		this.apiService.eventEdit(value,function(res){
			window.scrollTo(0,0);
			refreg.loadingSvc.setValue(false);
			refreg.countryId = res.data.country;
			// refreg.getCountryList();
			// refreg.stateId = res.data.state;
			// refreg.cityId = res.data.city;
			refreg.organizers = res.data.organizers;
			refreg.defaultVenue = [res.data.venue_name];
			refreg.showEventArr = res.data;
			// refreg.city = res.data.city;
			refreg.location = res.data.venue_id;
			refreg.keyword = res.data.category_id.join(',');
			refreg.audience = res.data.audience.join(',');
			refreg.endDateNormal = res.data.end_date;
			refreg.startDateNormal = res.data.start_date;
			if(res.data.image_id!=''){
			refreg.imagePreview = res.data.images;
			var Link = res.data.attachment;
			refreg.imageLink = Link.replace(/\\/g, "");
			refreg.imageArr.push(res.data.image_id);
			}
			refreg.afterGetData();
		},function(error){
			refreg.loadingSvc.setValue(false);
			refreg.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				localStorage.removeItem('auth_token');        
				refreg.apiService.signinSuccess$.emit(false);
				refreg.router.navigate(['/index']);
			}
		});
	}


	afterGetData() {
		var ref= this;

		jQuery('#eventstart-time, #eventend-time').timepicker({
			showSeconds: true
		});

		jQuery('#eventstart-time').on('change', function(){           
			var startTime = jQuery(this).val();            
			jQuery("#start-Time").val(startTime);       
		});

		jQuery('#eventend-time').on('change', function(){               
			var endTime = jQuery(this).val();            
			jQuery("#end-Time").val(endTime);
		});

		jQuery("#contactinfo").mask("(999) 999-9999");

		jQuery("#attach_ids").val('');
		var base_url = jQuery("#base_url").val();
		var urlVal;
		if(ref.imageLink){
			urlVal = JSON.parse(ref.imageLink)
		}else{
			urlVal = [];
		}
		console.log(urlVal);
		jQuery("#eventImages").fileinput({
			uploadUrl: "http://2016.geekmeet.com/admin/v1/upload_images",
			uploadAsync: true,
			overwriteInitial: false,
			showUpload: false,
			showRemove: false,
			resizeImage: true,
			allowedFileExtensions:['gif', 'png','jpg','jpeg'],
			initialPreview:ref.imagePreview,
			initialPreviewConfig:urlVal
		});

		var $image = jQuery('#eventImages');
		$image.on('fileuploaded', function (event, data, previewId, index) {
			console.log('uploaded');
			var form = data.form, files = data.files, extra = data.extra,
			response = data.response, reader = data.reader;
			var ids = jQuery("#attach_ids").val();
			console.log(ids);
			ref.imageArr = [];
			if (ids != '')
				{ ref.imageArr.push(ids); }

			ref.imageArr.push(response);

			jQuery("#attach_ids").val(ref.imageArr);
			jQuery("#pre_ids").val(ref.imageArr);
			jQuery("#" + previewId).attr("response_id", response);
		}).on("filebatchselected", function (event, files) {
			$image.fileinput("upload");
		});

		// delete Image

		// jQuery(document).on("click", ".kv-file-remove", function ()   {
		// 	debugger;
		// 	jQuery(this).attr("disabled", "disabled");
		// 	var del_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
		// 	ref.delete_image(del_id);
		// });


		jQuery(document).on("click", ".kv-file-remove", function () {
             var delete_id = jQuery(this).attr('data-key');
            if (typeof delete_id != 'undefined') {
            var del_id = delete_id;
           }
          else
       {
        del_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
        }
         ref.delete_image(del_id);
    });



		jQuery(document).on("click", ".file-upload-indicator", function ()   {
			if (jQuery(this).hasClass('yellow')){
				var status = 0;
			} else{
				var status = 1;
			}

			var featured_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
			var res = ref.featured_image(featured_id, status);
			if (res){
				jQuery(this).addClass('yellow');
			} else{
				jQuery(this).removeClass('yellow')
			}
		});

		// delete Image on load

		var pre_ids = jQuery("#pre_ids").val();
		if (pre_ids != '') {
			ref.delete_image(pre_ids);
		}

		jQuery('body').find("#cancel").click(function () {
			var url = jQuery(this).attr('data-href');
			var pre_ids = jQuery("#pre_ids").val();
			if (pre_ids != '') {
				jQuery.ajax({
					type: 'POST',
					url: "http://2016.geekmeet.com/admin/v1/remove_image",
					data: {id: pre_ids},
					success: function (data) {
					},
					complete:function(){
						window.location.href = '/event';
					}
				});
			} else{
				window.location.href = '/event'; }
			});


		// jQuery("body").find(".file-preview-thumbnails .file-upload-indicator").each(function () {
  //   var featured_image = jQuery(this).parents('.file-preview-initial').find('img').attr('featured_image');
  //           jQuery(this).attr('data-key', jQuery(this).parent('.file-actions').find(".kv-file-remove").attr("data-key"));
  //           if (featured_image == 1){
  //   jQuery(this).addClass('yellow');
  //           jQuery(this).html('<i class="fa fa-star fa-2"></i>');
  //   } else{
  //   jQuery(this).removeClass('yellow');
  //           jQuery(this).html('<i class="fa fa-star fa-2"></i>');
  //   }
  //   })

	}


	getOrganizationList(){
		var ref = this;
		ref.apiService.organizationNames(function(res){  
			if(res.message == 'token_expired'){
				localStorage.removeItem('auth_token');
				this.router.navigate(['/']);
			} 

			jQuery.each( res.data , function( key, value ) {   
				var valueid =  value.organization_id.toString();
				if(valueid === ref.organizers){
					ref.defaultOrg = [value.organization_name]
				}    
				var  item = {id:valueid, text:value.organization_name};       
				ref.organizationList.push(item);   
			});

			ref.organizationList = jQuery.makeArray( ref.organizationList );

		}, function(err){
			console.log(err);      
		});    
	}

	getVenueList(){
		var ref = this;
		ref.apiService.venueNames(function(res){      
			jQuery.each( res.data , function( key, value ) {   
				var valueid =  value.venue_id.toString();    
				var  item = {id:valueid, text:value.venue_name};       
				ref.venueList.push(item);   
			});

			ref.venueList = jQuery.makeArray( ref.venueList );
		}, function(err){
			console.log(err);
		});    
	} 

	getCategoryList(){
		var ref = this;
		ref.apiService.categoryList(function(res){
			ref.keywordList = res.data;
			var arr = jQuery.makeArray( res.data );

			for (var i = 0; i < arr.length; i++) {    
				ref.keywordList.push(arr[i].category_name);
			}

		}, function(err){
			console.log(err);
		});    
	} 

	getCountryList(){
		var ref = this;
		ref.loadingSvc.setValue(true);
		ref.apiService.countryList(function(res){
			ref.loadingSvc.setValue(false);
			jQuery.each( res.data , function( key, value ) {				
				var valueid =  value.id.toString();
				if(valueid === ref.countryId){
					ref.defaultCountry = [value.name];
					ref.getState(value);
				}   
				var  item = {id:valueid, text:value.name};       
				ref.countryArr.push(item);   
			});
			ref.countryArr = jQuery.makeArray( ref.countryArr );
		}, function(err){
			console.log(err);
		});
	}

	public getState(value:any):void {    
		var ref = this;
		ref.defaultState=[];
		ref.country = value.id;
		ref.loadingSvc.setValue(true);
		ref.apiService.stateList(value.id,function(res){
			ref.loadingSvc.setValue(false);
			jQuery.each( res.data , function( key, value ) {   
				var valueid =  value.state_id.toString();
				if(valueid === ref.stateId){
					ref.defaultState = [value.name];
					ref.getCIty(value);
				}    
				var  item = {id:valueid, text:value.name};       
				ref.stateList.push(item);   
			});

			ref.stateList = jQuery.makeArray( ref.stateList );

		}, function(err){
			console.log(err);
		});
	}

	public getCIty(value:any):void {   
		var ref = this;
		ref.defaultCity=[];
		var data;
		if(value.id){
			data=value.id;
			ref.state = value.id;
		}
		else{
			data=value.state_id;
			ref.state=value.state_id;
		}
		ref.loadingSvc.setValue(true);
		ref.apiService.cityList(data,function(res){
			ref.loadingSvc.setValue(false);
			jQuery.each( res.data , function( key, value ) {   
				var valueid =  value.city_id.toString();
				if(valueid === ref.cityId){
					ref.defaultCity = [value.name];
				}    
				var  item = {id:valueid, text:value.name};       
				ref.cityList.push(item);   
			});

			ref.cityList = jQuery.makeArray( ref.cityList );

		}, function(err){
			console.log(err);
		});
	}

	uploadImages(value:any){
		console.log(value);
	}

	public optionSelected(value:any,type:any):void { 
		console.log(value);
		switch (type) {
			case "city":
			this.city = value.id;
			break;    
			case "organization":
			this.organizers = value.id;
			break;   
			case "location":
			this.location = value.id;
			break;    
			case "audience":
			{
				var listdata = '';
				jQuery.each( value, function( key, data ) {          
					listdata =listdata+","+data.id;
				});
				listdata = listdata.replace(/(^,)|(,$)/g, "");
				this.audience = listdata;
			}      
			break;   
			case "keyword":
			{
				var listdata = '';
				jQuery.each( value, function( key, data ) {          
					listdata =listdata+","+data.id;
				});
				listdata = listdata.replace(/(^,)|(,$)/g, "");
				this.keyword = listdata;
			}
			break;    
		}

	}


	onDateChanged(event:any, type) {
		if(event.formatted !== '') {
			if(type=='start')
			{
				this.startTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
				this.startDateNormal = event.formatted;
			}  
			else
			{
				this.endTextNormal = 'Formatted: ' + event.formatted + ' - epoc timestamp: ' + event.epoc;
				this.endDateNormal = event.formatted;
			}    
			this.border = '1px solid #CCC';
		}
		else {
			if(type=='start'){
				this.startTextNormal = '';
				this.startDateNormal='';
			}
				else{
					this.endTextNormal = '';
					this.endDateNormal = '';
				} 
				this.border = 'none';
			}
		}

		timechange(event:any) {
		}

		updateEvent(value:any):void{
			var ref = this;
			console.log(value);
			value['event_id']=  ref.selectedData; 
			var start_time = jQuery("#start-Time").val();
			var end_time = jQuery("#end-Time").val();
			var upload_images = jQuery("#attach_ids").val();
			if(end_time){
				value.end_time  = end_time;
			}else{
				value.end_time = ref.showEventArr['end_time'];
			}
			if(start_time){
				value.start_time  = start_time;
			}else{
				value.start_time = ref.showEventArr['start_time'];
			}
			value.image_id	= upload_images;
			ref.loadingSvc.setValue(true);
			ref.apiService.updateEvent(value,function(res){
				ref.loadingSvc.setValue(false);
				var toastOptions:ToastOptions = {
					title: "Event Update!",
					msg: res.message,
					showClose: true,
					timeout: 1000,
					theme: 'bootstrap',
					onAdd: (toast:ToastData) => {

					},
					onRemove: function(toast:ToastData) {
						ref.router.navigate(['/my-events']);
					}
				};
				ref.toastyService.success(toastOptions);
				ref.router.navigate(['/event']);
			},function(error){
				ref.loadingSvc.setValue(false);
				if(error.status == 401 || error.status == '401' || error.status == 400){
					localStorage.removeItem('auth_token');        
					ref.apiService.signinSuccess$.emit(false);
					ref.router.navigate(['/index']);
				}
				ref.toastyService.error(error.json().message);
				var error = error.json().errors;
				ref.errors = error; 
			});
		}


		delete_image(ids){
			var ref = this;
			jQuery.ajax({
				type: 'POST',
				url: "http://2016.geekmeet.com/admin/v1/remove_image",
				data: {id: ids},
				success: function (data) {
					var res = jQuery.parseJSON(data)
					if (res.status == 1) {
						var attchstr = jQuery('body').find("#attach_ids").val();
						var new_string = ref.remove(attchstr, ids);
						console.log(new_string);
						ref.imageArr = []; 
						ref.imageArr.push(new_string);
						console.log(ref.imageArr);
						jQuery('body').find("#attach_ids").val('');
						jQuery('body').find("#attach_ids").val(ref.imageArr);
					}
				}
			});
			return 1;
		}

		featured_image(ids, status){

			jQuery.ajax({
				type: 'POST',
				url: "http://2016.geekmeet.com/admin/v1/set_featured_image",
				data: {id: ids, status:status},
				success: function (data) {
					var res = jQuery.parseJSON(data)
					if (res.status == 1) {
						return 1;
					} else{
						return 0;
					}
				}
			});
			return status;
		}

		remove(string, to_remove)
		{
			if (string != '' && typeof string != 'undefined') {
				var elements = string.split(",");
				var remove_index = elements.indexOf(to_remove);
				elements.splice(remove_index, 1); var result = elements.join(",");
				return result;
			}
		}


	}

