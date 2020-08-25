import {RouterModule, Routes, Router} from '@angular/router'
import { NgModule } from '@angular/core';
import { RowHolderComponent } from './row-holder/row-holder.component';
import { AuthenticationGuard } from './authentication.guard';
import { ForgotPasswordComponent } from './public-facing/forgot-password/forgot-password.component';
import { ConfirmForgotPasswordComponent } from './public-facing/confirm-forgot-password/confirm-forgot-password.component';
import { LoginComponent } from './public-facing/login/login.component';
import { RegisterComponent } from './public-facing/register/register.component';

const routes:Routes = [
    {path:'', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'app', component:RowHolderComponent, canActivate:[AuthenticationGuard]},
    {path:'forgot-password', component:ForgotPasswordComponent},
    {path:'forgot-password/confirm', component:ConfirmForgotPasswordComponent}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{}