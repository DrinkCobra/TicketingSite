import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { CreateTaskComponent } from './component/create-task/create-task.component';
import { SecureinnerpageGuard } from './secureinnerpage.guard';
import { AuthGuardGuard } from './auth-guard.guard';

const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [SecureinnerpageGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [SecureinnerpageGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'create-task',
    component: CreateTaskComponent,
    canActivate: [AuthGuardGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
