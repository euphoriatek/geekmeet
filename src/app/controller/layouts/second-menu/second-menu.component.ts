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
		var menuSelection = localStorage.getItem('secondMenuIndex');
		if(menuSelection!=undefined && menuSelection!=''){
			SecondMenuComponent.selectedIndex = parseInt(menuSelection);
		}

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
		localStorage.setItem('secondMenuIndex', index);
	}


	getEventByCategory(value, index){
		localStorage.setItem('secondMenuIndex', index);
		var ref= this;
		var urlString = value.split(" ").join("-");
		var newIndex = urlString.toLowerCase();
		SecondMenuComponent.selectedIndex = index;
		if(ref.router.url!="/"){
			if(ref.router.url=='/index'){
				this.onMenuChange.emit(value);
			}else{
				this.router.navigate(['/event',newIndex]);
			}
		}
		else{
			this.onMenuChange.emit(value);
		}

		console.log(SecondMenuComponent.selectedIndex);
			
	}


}
