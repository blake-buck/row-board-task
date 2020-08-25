import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseClass } from '../base-class';
import { Store } from '@ngrx/store';

@Component({
    selector:'register',
    templateUrl:'./register.component.html',
    styleUrls:['../public-facing.component.scss']
})

export class RegisterComponent extends BaseClass{
    register(e){
        e.preventDefault();
        this.http.post('http://localhost:3000/api/auth/register', {username:this.formValue.username, password:this.formValue.password}).subscribe(val => console.log(val));
    }
}