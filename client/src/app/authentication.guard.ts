import { CanActivate, Router } from '@angular/router';
import { AppService } from './store/app.service';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate{
    constructor(private service: AppService, private router:Router){}

    async canActivate(){
        if(this.service.isAccessTokenExpired()){
            try{
                const result:any = await this.service.refresh().toPromise()
                localStorage.setItem('accessToken', result.message.AuthenticationResult.AccessToken)
                return true
            }
            catch(e){
                return this.router.parseUrl('/');
            }
        }
        return true;
    }
}