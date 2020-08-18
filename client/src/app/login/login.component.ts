import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector:'login',
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.scss']
})

export class LoginComponent{
    constructor(private router:Router, private http:HttpClient){}

    formValue ={
        username:'',
        password:''
    }

    login(e){
        e.preventDefault();
        this.http.post('http://localhost:3000/api/auth/login', {username:this.formValue.username, password:this.formValue.password}).subscribe(val => console.log(val));
        this.router.navigate(['app'])
    }

    changeValue(property, e){
        this.formValue[property] = e.target.value;
    }


}