import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: 'about.component.html',
})
export class AboutComponent implements OnInit {
    title = 'Tour of Heroes sssc hellow world from Webpack Run';

    ngOnInit() { }

    test() {
        console.log('hello from test');
    }
}
