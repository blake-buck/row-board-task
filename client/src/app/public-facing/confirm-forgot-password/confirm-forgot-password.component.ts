import { Component } from '@angular/core';
import { BaseClass } from '../base-class';
import { confirmForgotPassword } from 'src/app/store/app.actions';
import { selectUserEmail } from 'src/app/store/app.selector';
import { first } from 'rxjs/operators';

@Component({
    selector:'confirm-forgot-password',
    templateUrl:'./confirm-forgot-password.component.html',
    styleUrls:['../public-facing.component.scss']
})

export class ConfirmForgotPasswordComponent extends BaseClass{
    userEmail$ = this.store.select(selectUserEmail);
    confirmForgotPassword(e){
        e.preventDefault();
        this.userEmail$
            .pipe(first())
            .subscribe(userEmail => {
                const passwordsMatch = this.formValue.password === this.formValue.confirmPassword;
                if(passwordsMatch){
                    this.formValue.username = userEmail;
                    this.store.dispatch(confirmForgotPassword({formValue: this.formValue}));
                }
            });
    }
}