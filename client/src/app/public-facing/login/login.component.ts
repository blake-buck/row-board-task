import { Component } from '@angular/core';
import { login } from '../../store/app.actions';
import { BaseClass } from '../base-class';

@Component({
    selector:'login',
    templateUrl:'./login.component.html',
    styleUrls:['../public-facing.component.scss']
})

export class LoginComponent extends BaseClass{

    login(e){
        e.preventDefault();
        this.store.dispatch(login({loginForm: this.formValue}));
    }
}