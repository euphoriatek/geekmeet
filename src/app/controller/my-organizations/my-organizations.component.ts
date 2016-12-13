import { Component, OnInit } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../model/api-method.service';
// import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var jQuery: any;

@Component({
  selector: 'app-my-organizations',
  templateUrl: '../../view/my-organizations/my-organizations.component.html',
  styleUrls: ['../../assets/css/my-organizations/my-organizations.component.css']
})
export class MyOrganizationsComponent implements OnInit {
  organizationArr:any=[];
	Total:Object;
	currentPage:Object;
	getToken:any;
  deleteID:any;

  constructor(private router:Router, public apiService:ApiMethodService) { }

  ngOnInit() {
  	 this.getToken = this.apiService.getLoginToken();
    if(!(this.getToken)){
      this.router.navigate(['/']);
    }
  	this.OrganizationList(1);
   
  }

   OrganizationList(value){
		var ref = this;
		this.apiService.organizationList(value,function(res){
		    ref.organizationArr = res.data.data;
		    ref.Total = res.data.last_page;
        ref.currentPage = res.data.current_page;   			
		},function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        console.log("profile error");
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
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

    getOrganizationPagination(page){
    this.OrganizationList(page);
  }

  setDeleteID(id){
   this.deleteID = id;
  }

  deleteOrg(){
    var ref = this;
    console.log(this.deleteID);
    this.apiService.organizationDelete(this.deleteID,function(res){
     ref.OrganizationList(1);        
    },function(error){
      if(error.status == 401 || error.status == '401' || error.status == 400){
        localStorage.removeItem('auth_token');        
        ref.apiService.signinSuccess$.emit(false);
        ref.router.navigate(['/index']);
      }
    });
  }

}
