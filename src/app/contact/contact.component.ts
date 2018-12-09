import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: 'contact.component.html',
})
export class ContactComponent implements OnInit {
    title = 'Tour of Heroes sssc hellow world from Webpack Run';

    ngOnInit() { }

    test() {
        console.log('hello from test');
    }
}
