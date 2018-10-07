import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css', 'app.component.scss'],
  templateUrl: 'app.component.html',
})
export class AppComponent {
  private title = 'Tour of Heroes';

  test() {
    console.log('hello from test');
  }
}
