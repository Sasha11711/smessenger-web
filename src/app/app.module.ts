import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { MessengerComponent } from "./messenger/messenger.component";
import { RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ChatsComponent } from "./messenger/chats/chats.component";
import { ChatComponent } from "./messenger/chat/chat.component";
import { ChatCreateComponent } from "./messenger/chat-create/chat-create.component";
import { MessageItemComponent } from "./messenger/chat/message-item/message-item.component";
import { NgOptimizedImage } from "@angular/common";
import { ChatItemComponent } from "./messenger/chats/chat-item/chat-item.component";
import { HeaderComponent } from "./messenger/header/header.component";
import { ChatSettingsComponent } from "./messenger/chat/chat-settings/chat-settings.component";
import { ContextMenuComponent } from "./messenger/context-menu/context-menu.component";
import { UserItemComponent } from "./messenger/users/user-item/user-item.component";
import { UsersComponent } from "./messenger/users/users.component";
import { SettingsComponent } from "./messenger/settings/settings.component";
import { UpdateUserComponent } from "./messenger/settings/update-user/update-user.component";
import { SecurityUserComponent } from "./messenger/settings/security-user/security-user.component";
import { ThemeComponent } from "./messenger/settings/theme/theme.component";

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MessengerComponent, ChatsComponent, ChatComponent, ChatCreateComponent, MessageItemComponent, ChatItemComponent, HeaderComponent, ChatSettingsComponent, ContextMenuComponent, UserItemComponent, UsersComponent, SettingsComponent, UpdateUserComponent, SecurityUserComponent, ThemeComponent],
  imports: [BrowserModule, AppRoutingModule, RouterOutlet, HttpClientModule, FormsModule, ReactiveFormsModule, NgOptimizedImage],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
