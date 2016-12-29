import { Component, OnInit,Output,EventEmitter} from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { ApiMethodService } from '../../../model/api-method.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'app-second-menu',
	templateUrl: '../../../view/layouts/second-menu/second-menu.component.html',
	styleUrls: ['../../../assets/css/layouts/second-menu/second-menu.component.css']
})


export class SecondMenuComponent implements OnInit {
	menuArr:any;
	popularArr:any;
	static selectedIndex = -1;
	@Output() onMenuChange = new EventEmitter<string>();
	constructor(private router:Router, public apiService:ApiMethodService) { }

	ngOnInit() {
		this.secondmenuDeafault();
		var testData = this;
		this.apiService.testFunction(testData);

	}
	returnIndex(){
		return SecondMenuComponent.selectedIndex;
	}
	secondmenuDeafault(){
		var ref = this;
		this.apiService.SecondMenuApi(function(res){
			ref.menuArr = res.data;
		});
	}

	public indexSelection(index){
		SecondMenuComponent.selectedIndex = index;
	}


	getEventByCategory(value, index){
		console.log("get");
		var ref= this;
		SecondMenuComponent.selectedIndex = index;
		if(ref.router.url!="/"){
			if(ref.router.url=='/index'){
				this.onMenuChange.emit(value);
			}else{
				this.router.navigate(['/event',value]);
			}
		}
		else{
			this.onMenuChange.emit(value);
		}

		console.log(SecondMenuComponent.selectedIndex);
			
	}


}
