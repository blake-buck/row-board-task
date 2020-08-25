import { LoginComponent } from "./login/login.component";
import {RouterModule, Routes, Router} from '@angular/router'
import { NgModule } from '@angular/core';
import { RowHolderComponent } from './row-holder/row-holder.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationGuard } from './authentication.guard';

const routes:Routes = [
    {path:'', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'app', component:RowHolderComponent, canActivate:[AuthenticationGuard]}
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule{}