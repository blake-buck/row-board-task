import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { changePassword, deleteAccount } from 'src/app/store/app.actions';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/store/app.state';

@Component({
    selector:'account-page',
    templateUrl:'./account.component.html',
    styleUrls:['./account.component.scss']
})

export class AccountComponent{
    constructor(private store:Store<AppStore>, private router:Router){}

    forms = {
        changePassword:{
            previousPassword:'',
            proposedPassword:'',
            confirmPassword:''
        },

        deleteAccount:{
            delete:''
        }

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

    deleteAccount(e){
        e.preventDefault();
        const form = this .forms.deleteAccount;
        if(form.delete !== 'delete'){
            throw new Error('Type "delete" in the field to delete your account.');
        }
        this.store.dispatch(deleteAccount());
    }

    toKanban(){
        this.router.navigate(['app']);
    }
}