import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { MessengerComponent } from "./components/messenger/messenger.component";
import { NgModule } from "@angular/core";
import { authGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: '', component: MessengerComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
