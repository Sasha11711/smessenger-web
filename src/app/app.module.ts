import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MessengerComponent } from './messenger/messenger.component';
import { RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ChatsComponent } from './messenger/chats/chats.component';
import { ChatComponent } from './messenger/chat/chat.component';
import { ChatCreateComponent } from './messenger/chat-create/chat-create.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MessengerComponent, ChatsComponent, ChatComponent, ChatCreateComponent],
  imports: [BrowserModule, AppRoutingModule, RouterOutlet, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
