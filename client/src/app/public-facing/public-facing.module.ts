import { NgModule } from '@angular/core';
import { ConfirmForgotPasswordComponent } from './confirm-forgot-password/confirm-forgot-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatListModule, MatToolbarModule } from '@angular/material';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports:[
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatListModule,
        CommonModule,
        RouterModule
    ],
    declarations:[
        ConfirmForgotPasswordComponent,
        ForgotPasswordComponent,
        LoginComponent,
        RegisterComponent,
        LandingComponent
    ]
})

export class PublicFacingModule {}