import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { login } from '../store/app.actions';

@Component({
    selector:'login',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.scss']
})

export class LoginComponent{
    constructor(private store:Store<any>){}

    formValue ={
        username:'',
        password:''
    }

    login(e){
        e.preventDefault();
        this.store.dispatch(login({loginForm: this.formValue}));
    }

    changeValue(property, e){
        this.formValue[property] = e.target.value;
    }

}