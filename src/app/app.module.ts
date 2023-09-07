import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MessengerComponent } from './components/messenger/messenger.component';
import { RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ChatsComponent } from './components/messenger/chats/chats.component';
import { ChatComponent } from './components/messenger/chat/chat.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MessengerComponent, ChatsComponent, ChatComponent],
  imports: [BrowserModule, AppRoutingModule, RouterOutlet, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
