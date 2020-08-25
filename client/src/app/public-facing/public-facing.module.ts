import { NgModule } from '@angular/core';
import { ConfirmForgotPasswordComponent } from './confirm-forgot-password/confirm-forgot-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule } from '@angular/material';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    imports:[
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
    ],
    declarations:[
        ConfirmForgotPasswordComponent,
        ForgotPasswordComponent,
        LoginComponent,
        RegisterComponent
    ]
})

export class PublicFacingModule {}