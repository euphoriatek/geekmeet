import { Component } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';
import { MetaService } from 'ng2-meta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private metaService: MetaService) {
	}
  title = 'app works!';
  onActivate(e, outlet){
    outlet.scrollTop = 0;
    window.scrollTo(0, 0);
  }

//   window.onbeforeunload = function() {
//   localStorage.removeItem('city_for_event');
//   return '';
// };
}
