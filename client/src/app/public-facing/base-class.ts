import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppStore } from '../store/app.state';

export class BaseClass{
    constructor(public store: Store<AppStore>, public http:HttpClient, public router: Router){}
    formValue ={
        username:'',
        password:'',
        confirmPassword:'',
        confirmationCode:''
    }

    changeValue(property, e){
        this.formValue[property] = e.target.value;
    }

    navTo(path){
        this.router.navigate([path])
    }
}