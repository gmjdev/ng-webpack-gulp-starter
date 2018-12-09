import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-index',
    templateUrl: 'index.component.html',
})
export class IndexComponent implements OnInit {
    title = 'Tour of Heroes sssc hellow world from Webpack Run';
    ngOnInit() { }

    test() {
        console.log('hello from test');
    }
}
