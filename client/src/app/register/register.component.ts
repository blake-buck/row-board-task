import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector:'register',
    templateUrl:'./register.component.html',
    styleUrls:['./register.component.scss']
})

export class RegisterComponent{
    registerForm;
    
    constructor(private http:HttpClient){ }

    register(e){
        e.preventDefault();
        this.http.post('http://localhost:3000/api/auth/register', {username:'', password:''}).subscribe(val => console.log(val));
    }
}