import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppService{
    constructor(private http:HttpClient){}

    login({username, password}){
        return this.http.post(`${environment.apiUrl}/api/auth/login`, {username, password});
    }

    addTokensToStorage(tokens:{refreshToken?:string, accessToken?:string}){
        if(tokens.refreshToken){
            localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        if(tokens.accessToken){
            localStorage.setItem('accessToken', tokens.accessToken);
        }
    }

}