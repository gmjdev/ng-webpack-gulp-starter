import { Component, OnInit } from '@angular/core';
// import '../global.scss';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    title = 'Tour of Heroes sssc hellow world from Webpack Run';

    ngOnInit() { }

    test() {
        console.log('hello from test');
    }
}
