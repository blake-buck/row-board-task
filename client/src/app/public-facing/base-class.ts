import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export class BaseClass{
    constructor(public store: Store<any>, public http:HttpClient, public router: Router){}
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