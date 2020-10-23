import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {initialState} from './app.state';
import { Router } from '@angular/router';

@Injectable()
export class AppService{
    constructor(private http:HttpClient, private router: Router){}

    login({username, password}){
        return this.http.post(`${environment.apiUrl}/api/auth/login`, {username, password});
    }

    logout(){
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        this.router.navigate(['/']);
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

    async completeRefreshToken(apiCall){
        if(this.isAccessTokenExpired()){
            try{
                const accessToken = (await this.refresh().toPromise<any>()).message.AuthenticationResult.AccessToken
                this.addTokensToStorage({accessToken})
            }
            catch(e){
                // if this request fails, best to assume that the refresh token has expired.
                this.logout();
                throw new Error('Reauthentication is required.')
            }
        }

        return await apiCall().toPromise();
    }

    forgotPassword(username){
        return this.http.post(`${environment.apiUrl}/api/auth/forgot-password`, {username});
    }

    confirmForgotPassword({username, password, confirmationCode}){
        return this.http.post(`${environment.apiUrl}/api/auth/forgot-password/confirm`, {username, password, confirmationCode});
    }

    changePassword({previousPassword, proposedPassword}){
        return this.completeRefreshToken(() => this.http.post(`${environment.apiUrl}/api/auth/change-password`, {previousPassword, proposedPassword}));
    }

    deleteAccount(){
        return this.completeRefreshToken(() => this.http.delete(`${environment.apiUrl}/api/auth/delete-account`));
    }

    retrieveStateFromDb(){
        return this.completeRefreshToken(() => this.http.get(`${environment.apiUrl}/api/data/state`));
    }

    initializeDbState(){
        return this.completeRefreshToken(() => this.http.post(`${environment.apiUrl}/api/data/state`, initialState));
    }

    updateDbState(appState){
        return this.completeRefreshToken(() => this.http.put(`${environment.apiUrl}/api/data/state`, appState));
    }

    deleteDbState(){
        return this.completeRefreshToken(() => this.http.delete(`${environment.apiUrl}/api/data/state`));
    }

    uploadFile(fileName, dataUrl){
        return this.completeRefreshToken(() => this.http.post(`${environment.apiUrl}/api/data/file`, {fileName, dataUrl}));
    }

    deleteFile(fileName){
        return this.completeRefreshToken(() => this.http.delete(`${environment.apiUrl}/api/data/file/${fileName}`));
    }
}