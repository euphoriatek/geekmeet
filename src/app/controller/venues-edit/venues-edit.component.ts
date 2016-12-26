import { Component, OnInit ,ViewEncapsulation,ViewChild} from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { AgmCoreModule, SebmGoogleMap } from 'angular2-google-maps/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {CKEditorModule} from 'ng2-ckeditor';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {SelectModule} from 'ng2-select/ng2-select';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare const google: any;
declare var jQuery: any;

@Component({
	selector: 'app-venues-edit',
	templateUrl: '../../view/venues-edit/venues-edit.component.html',
	styleUrls: ['../../assets/css/venues-edit/venues-edit.component.css','../../assets/css/eventadd/fileinput.min.css'],
	encapsulation: ViewEncapsulation.None,
})
export class VenuesEditComponent implements OnInit {
	src: string = "";
	countryList:any;
	locationFinder:any;
	getToken:any;
	detailArr:Object = {};
	stateList:any;
	venueId:any;
	cityList:any;
	imagePreview:any;
	geocoder:any;
	imageLink:any;
	imageArr:Array<string> = [];
	pre_arr:Array<string> = [];
	errors:Object = {};
	center:Object = {
		latitude:51.678418,
		longitude:7.809007
	};
	getLocation = true;
	resizeOptions: ResizeOptions = {
		resizeMaxHeight: 128,
		resizeMaxWidth: 128
	};

	constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}

	ngOnInit() {
		// @ViewChild('myMap') mymap: SebmGoogleMap
		var s1 = document.createElement("script");
		s1.type = "text/javascript";
		s1.src = "../../app/assets/js/jquery/fileinput.min.js";
		jQuery("head").append(s1);

		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		

		

		this.route.params.subscribe(params => {
			this.venueDetail(params['id']);
			this.venueId = params['id'];
		});
		this.getCountryList();
	}

	selected(imageResult: ImageResult) {
		this.src = imageResult.dataURL;
	}

	venueDetail(id){
		var ref = this;
		ref.loadingSvc.setValue(true); 
		ref.apiService.editVenueDetails(id,function(res){  
			ref.loadingSvc.setValue(false);    
			ref.detailArr = res.data;
			if(res.data.country){
				ref.getState(res.data.country);
			}
			if(res.data.state){
				ref.getCIty(res.data.state);
			}
			if(res.data.venue_image!=''){
				ref.imagePreview = res.data.images;
				var Link = res.data.attachment;
				ref.imageLink = Link.replace(/\\/g, "");
				ref.imageArr.push(res.data.venue_image);
			}
			ref.afterGetData();
		}, function(error){
			ref.loadingSvc.setValue(false); 
			ref.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				localStorage.removeItem('auth_token');        
				ref.apiService.signinSuccess$.emit(false);
				ref.router.navigate(['/index']);
			}
		});
	}

	afterGetData() {
		var ref= this;
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
			ref.pre_arr = [];
			if (ids != '')
				{ ref.imageArr.push(ids); }

			ref.imageArr.push(response);
			var pre_ids = jQuery("#pre_ids").val();
			
			if (pre_ids != ''){
				ref.pre_arr.push(pre_ids);
			}
			
			ref.pre_arr.push(response);
			console.log("thids is "+ref.pre_arr);
			jQuery("#attach_ids").val(ref.imageArr);
			jQuery("#pre_ids").val(ref.pre_arr);
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

			// var pre_ids = jQuery("#pre_ids").val();
			// if (pre_ids != '') {
				// 	ref.delete_image(pre_ids);
				// }

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


				jQuery("body").find(".file-preview-thumbnails .file-upload-indicator").each(function () {
					  var featured_image = jQuery(this).parents('.file-preview-initial').find('img').attr('featured_image');
					          jQuery(this).attr('data-key', jQuery(this).parent('.file-actions').find(".kv-file-remove").attr("data-key"));
					          if (featured_image == 1){
						  jQuery(this).addClass('yellow');
						          jQuery(this).html('<i class="fa fa-star fa-2"></i>');
						  } else{
							  jQuery(this).removeClass('yellow');
							          jQuery(this).html('<i class="fa fa-star fa-2"></i>');
							  }
							  })

						}

						getCountryList(){
							var ref = this;
							ref.apiService.countryList(function(res){
								ref.countryList = res.data;
							}, function(err){
								console.log(err);
							});
						}

						getState(id){
							var ref = this;
							ref.apiService.stateList(id,function(res){
								ref.stateList = res.data;
							}, function(err){
								console.log(err);
							});
						}

						getCIty(id){
							var ref = this;
							ref.apiService.cityList(id,function(res){
								ref.cityList = res.data;
								ref.getLatLong(ref.detailArr);
							}, function(err){
								console.log(err);
							});
						}

						getLatLong(val:any):void{
							console.log(val);
							var ref = this;
							var country = '';
							var state ='';
							var city = '';
							var address = val.address;
							for (var i = 0; i < ref.countryList.length; i++) {
								if(val.country == ref.countryList[i].id){
									country = ref.countryList[i].name;
									break;
								}
							}
							for (var i = 0; i < ref.stateList.length; i++) {
								if(val.state == ref.stateList[i].state_id){
									state = ref.stateList[i].name;
									break;
								}
							}

							for (var i = 0; i < ref.cityList.length; i++) {
								if(val.city == ref.cityList[i].city_id){
									city = ref.cityList[i].name;
									break;
								}
							}
							var apiAddress = address+','+city+','+state+' '+country;
							console.log(apiAddress);
							ref.geocoder = new google.maps.Geocoder();
							ref.geocoder.geocode( { 'address': apiAddress}, function(results, status) {
								console.log(status);
								if (status == 'OK') { 
									ref.locationFinder='';
									ref.detailArr['latitude'] = results[0].geometry.location.lat();
									ref.detailArr['longitude'] = results[0].geometry.location.lng();
								}
								else{
									ref.locationFinder = "Can Not Find Location.!";
								}
							});

						}

						updateVenue(value:any):void{
							var ref = this;
							ref.loadingSvc.setValue(true);
							value['vanue_id'] = ref.venueId;
							var upload_images = jQuery("#attach_ids").val();
							value.venue_image	= upload_images;
							ref.apiService.updateVenue(value,function(res){
								ref.loadingSvc.setValue(false);
								ref.toastyService.success(res.message);
								ref.router.navigate(['/my-venues']);
							},function(error){
								ref.loadingSvc.setValue(false);
								ref.toastyService.error(error.json().message);
								if(error.status == 401 || error.status == '401' || error.status == 400){
									localStorage.removeItem('auth_token');        
									ref.apiService.signinSuccess$.emit(false);
									ref.router.navigate(['/index']);
								}
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
