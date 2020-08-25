import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor{
    intercept(req, next){
        if(localStorage.getItem('accessToken')){
            const updatedHeaders = req.clone({
                headers: req.headers.set('jwt', localStorage.getItem('accessToken'))
            })
            return next.handle(updatedHeaders);
        }
        
        return next.handle(req);
    }
}