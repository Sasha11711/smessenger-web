import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MessengerComponent } from './components/messenger/messenger.component';
import { RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MessengerComponent],
  imports: [BrowserModule, AppRoutingModule, RouterOutlet],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
