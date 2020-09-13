import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AppService } from './store/app.service';
import { first, map } from 'rxjs/operators';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor{
    constructor(private service:AppService){}
    
    intercept(req, next){
        if(localStorage.getItem('accessToken')){
            if(this.service.isAccessTokenExpired()){
                return this.service.refresh().pipe(
                    first(),
                    map((result:any) => {
                        const accessToken = result.message.AuthenticationResult.RefreshToken;
                        this.service.addTokensToStorage({accessToken});
                        const updatedHeaders = req.clone({
                            headers: req.headers.set('jwt', accessToken)
                        })
                        return next.handle(updatedHeaders);
                    })
                )
            }

            const updatedHeaders = req.clone({
                headers: req.headers.set('jwt', localStorage.getItem('accessToken'))
            })
            return next.handle(updatedHeaders);
        }
        
        return next.handle(req);
    }
}