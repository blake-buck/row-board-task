import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { changePassword } from 'src/app/store/app.actions';

@Component({
    selector:'account-page',
    templateUrl:'./account.component.html',
    styleUrls:['./account.component.scss']
})

export class AccountComponent{
    constructor(private store:Store<any>){}

    forms = {
        changePassword:{
            previousPassword:'',
            proposedPassword:'',
            confirmPassword:''
        },

    }

    changeForm(e, form, field){
        this.forms[form][field] = e.target.value;
    }

    changePassword(e){
        e.preventDefault();
        const form = this.forms.changePassword;
        if(form.proposedPassword !== form.confirmPassword){
            throw new Error('Password fields must match.');
        }
        this.store.dispatch(changePassword({formValue:form}))
    }
}