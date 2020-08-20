import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// verifies user JWT
const jwkToPem = require('jwk-to-pem');
const jwk = require('../../jwks.json');

@Injectable()
export class JwtGuard implements CanActivate{
    constructor(private jwtService:JwtService){}
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const jwt = request.headers?.jwt
        if(jwt){
            return this.jwtService.verify(
                jwt, 
                {algorithms: ['RS256'], secret: jwkToPem(jwk.keys[1])}
            )
        }
        return false;
    }
}