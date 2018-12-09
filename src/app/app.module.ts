import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { IndexComponent } from './index/index.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, AboutComponent, ContactComponent, IndexComponent],
    imports: [BrowserModule, FormsModule, AppRoutingModule, MDBBootstrapModule, HttpModule],
})
export class AppModule { }
