import { Component } from '@angular/core';
import '../global.scss';
import '../global.css';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss', './app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  title = 'Tour of Heroes sssc hellow world from Webpack Run';

  test() {
    console.log('hello from test');
  }
}
