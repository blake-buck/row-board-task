import { Component } from '@angular/core';
import { BaseClass } from '../base-class';
import { forgotPassword } from 'src/app/store/app.actions';


@Component({
    selector:'forgot-password-component',
    templateUrl:'./forgot-password.component.html',
    styleUrls:['../public-facing.component.scss']
})

export class ForgotPasswordComponent extends BaseClass{
    forgotPassword(e){
        e.preventDefault();
        this.store.dispatch(forgotPassword({formValue: this.formValue}));
    }
}