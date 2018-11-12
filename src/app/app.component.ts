import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss', './app.component.css'],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  title = 'Tour of Heroes sssc hellow world';

  test() {
    console.log('hello from test');
  }
}
