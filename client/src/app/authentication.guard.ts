import { CanActivate, Router } from '@angular/router';
import { AppService } from './store/app.service';
import { Injectable } from '@angular/core';
import { ApiResult } from './store/app.effects';


@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate{
    constructor( private router:Router){}

    async canActivate(){
        if(localStorage.getItem('refreshToken') && localStorage.getItem('accessToken')){
            return true;
        }
        return this.router.parseUrl('/');
    }
}