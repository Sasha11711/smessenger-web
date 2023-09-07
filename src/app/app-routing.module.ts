import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { MessengerComponent } from "./components/messenger/messenger.component";
import { NgModule } from "@angular/core";
import { authGuard } from "./guards/auth.guard";
import { noAuthGuard } from "./guards/no-auth.guard";

const routes: Routes = [
  { path: '', component: MessengerComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
