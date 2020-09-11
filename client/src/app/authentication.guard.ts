import { CanActivate, Router } from '@angular/router';
import { AppService } from './store/app.service';
import { Injectable } from '@angular/core';
import { ApiResult } from './store/app.effects';


@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate{
    constructor(private service: AppService, private router:Router){}

    async canActivate(){
        if(this.service.isAccessTokenExpired()){
            try{
                const result:ApiResult = await this.service.refresh().toPromise<any>()
                localStorage.setItem('accessToken', result.message.AuthenticationResult.AccessToken)
            }
            catch(e){
                return this.router.parseUrl('/');
            }
        }
        return true;
    }
}