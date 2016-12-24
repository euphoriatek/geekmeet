import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiMethodService } from '../../model/api-method.service';
import { RouterModule, Router,ActivatedRoute }   from '@angular/router';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { AgmCoreModule } from 'angular2-google-maps/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {CKEditorModule} from 'ng2-ckeditor';
import { LoadingAnimateService } from 'ng2-loading-animate';
import {SelectModule} from 'ng2-select/ng2-select';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare const google: any;
declare var jQuery: any;
@Component({
	selector: 'app-venues-add',
	templateUrl: '../../view/venues-add/venues-add.component.html',
	styleUrls: ['../../assets/css/venues-add/venues-add.component.css','../../assets/css/venues-add/fileinput.min.css']
})
export class VenuesAddComponent implements OnInit {
	src: string = "";
	getToken:any;
	countryList:any;
	stateList:any;
	locationErr:any;
	cityList:any;
	center:Object = {};
	getLocation = false;
	orgDetail:any = {};
	errors:Object = {};
	imageArr:Array<string> = [];
	resizeOptions: ResizeOptions = {
		resizeMaxHeight: 128,
		resizeMaxWidth: 128
	};
	geocoder:any;

	constructor(private loadingSvc: LoadingAnimateService,private router:Router,private route: ActivatedRoute,private toastyService:ToastyService,public apiService:ApiMethodService,private toastyConfig: ToastyConfig) {
		this.toastyConfig.theme = 'bootstrap';
	}

	ngOnInit() {
		this.getToken = this.apiService.getLoginToken();
		if(!(this.getToken)){
			this.router.navigate(['/']);
		}
		var s1 = document.createElement("script");
		s1.type = "text/javascript";
		s1.src = "../../app/assets/js/jquery/fileinput.min.js";
		jQuery("head").append(s1);
		this.getCountryList();
	}

	ngAfterViewInit() { 
     // Upload Image       
    jQuery("#attach_ids").val('');
    var base_url = jQuery("#base_url").val();
    jQuery("#eventImages").fileinput({
            uploadUrl: "http://2016.geekmeet.com/admin/v1/upload_images",
            uploadAsync: true,
            overwriteInitial: false,
            showUpload: false,
            showRemove: false,
            resizeImage: true,
            allowedFileExtensions:['gif', 'png','jpg','jpeg']                              
    });

    var ref = this;
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

        jQuery(document).on("click", ".kv-file-remove", function ()   {
        jQuery(this).attr("disabled", "disabled");
            var del_id = jQuery(this).parents(".file-preview-frame").attr("response_id");
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


    jQuery(document).on('click', '#add_more', function(){
    var obj = jQuery(document).find("#add_more_div").clone();
            console.log(jQuery(document).find("#add_more_div"));
            jQuery(obj).removeAttr('hidden');
            jQuery(obj).removeAttr('id');
            jQuery(obj).appendTo("#images_div");
    });

    jQuery(document).on('click', '#remove_image', function(){
        jQuery(this).parents('.form-group').remove();
    });  




  }



	selected(imageResult: ImageResult) {
		this.src = imageResult.dataURL;
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
		}, function(err){
			console.log(err);
		});
	}

	getLatLong(val){
		var ref = this;
		if(val.country=='' || val.state ==''){
			ref.locationErr = "Please Select Contry or State";
		}
		else{
			ref.getLocation = true;
			ref.locationErr = '';
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
				if (status == 'OK') { 
					ref.center['latitude'] = results[0].geometry.location.lat();
					ref.center['longitude'] = results[0].geometry.location.lng();
				}
			});
		}
		
	}



	addVenue(value:any):void{
		var ref = this;
		var upload_images = jQuery("#attach_ids").val();
		value.venue_image = upload_images;
		ref.loadingSvc.setValue(true);
		ref.apiService.addVenue(value,function(res){
			ref.loadingSvc.setValue(false);
			var toastOptions:ToastOptions = {
				title: "Add.!",
				msg: res.message,
				showClose: true,
				timeout: 1000,
				theme: 'bootstrap',
				onRemove: function(toast:ToastData) {ref.router.navigate(['/my-venues']);}
			};
			ref.toastyService.success(toastOptions);
		},function(error){
			ref.loadingSvc.setValue(false);
			ref.toastyService.error(error.json().message);
			if(error.status == 401 || error.status == '401' || error.status == 400){
				console.log("profile error");
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
            ref.imageArr = []; ref.imageArr.push(new_string);
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
