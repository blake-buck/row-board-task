import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppService{
    constructor(private http:HttpClient){}

    login({username, password}){
        return this.http.post(`${environment.apiUrl}/api/auth/login`, {username, password});
    }

    refresh(){
        const refreshToken = localStorage.getItem('refreshToken');
        return this.http.post(`${environment.apiUrl}/api/auth/refresh`, {refreshToken});
    }

    addTokensToStorage(tokens:{refreshToken?:string, accessToken?:string}){
        if(tokens.refreshToken){
            localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        if(tokens.accessToken){
            localStorage.setItem('accessToken', tokens.accessToken);
        }
    }

    isAccessTokenExpired(){
        const accessToken = localStorage.getItem('accessToken');
        if(!accessToken){
            return true;
        }
        
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));

        return tokenPayload.exp - Math.floor(Date.now()/1000) < 0;
    }

    forgotPassword(username){
        return this.http.post(`${environment.apiUrl}/api/auth/forgot-password`, {username});
    }

    confirmForgotPassword({username, password, confirmationCode}){
        return this.http.post(`${environment.apiUrl}/api/auth/forgot-password/confirm`, {username, password, confirmationCode});
    }

    changePassword({previousPassword, proposedPassword}){
        return this.http.post(`${environment.apiUrl}/api/auth/change-password`, {previousPassword, proposedPassword});
    }

    deleteAccount(){
        return this.http.delete(`${environment.apiUrl}/api/auth/delete-account`);
    }
}