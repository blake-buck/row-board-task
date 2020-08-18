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
    formValue ={
        username:'',
        password:''
    }
    
    constructor(private http:HttpClient){ }

    changeValue(property, e){
        this.formValue[property] = e.target.value;
    }

    register(e){
        e.preventDefault();
        this.http.post('http://localhost:3000/api/auth/register', {username:this.formValue.username, password:this.formValue.password}).subscribe(val => console.log(val));
    }
}