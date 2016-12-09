import { Component } from '@angular/core';
import { RouterModule, Router }   from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  onActivate(e, outlet){
    outlet.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}
