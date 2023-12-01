import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { MessengerComponent } from "./messenger/messenger.component";
import { NgModule } from "@angular/core";
import { authGuard } from "../guards/auth.guard";
import { noAuthGuard } from "../guards/no-auth.guard";
import {ChatCreateComponent} from "./messenger/chat-create/chat-create.component";
import { UsersComponent } from "./messenger/users/users.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  { path: '', component: MessengerComponent, canActivate: [authGuard] },
  { path: "create", component: ChatCreateComponent, canActivate: [authGuard] },
  { path: "users", component: UsersComponent, canActivate: [authGuard] },
  { path: "login", component: LoginComponent, canActivate: [noAuthGuard] },
  { path: "register", component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: "settings", component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
