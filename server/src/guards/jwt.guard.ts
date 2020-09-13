import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// verifies user JWT
const jwkToPem = require('jwk-to-pem');
const jwk = require('../../jwks.json');

@Injectable()
export class JwtGuard implements CanActivate{
    constructor(private jwtService:JwtService, private configService:ConfigService){}
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const jwt = request.headers?.jwt
        const decodedToken:any = this.jwtService.decode(jwt);

        if(jwt){
            return this.jwtService.verify(
                jwt, 
                {algorithms: ['RS256'], secret: jwkToPem(jwk.keys[1])}
            ) 
            && decodedToken.iss === this.configService.get('AWS_ISS')
            && decodedToken.client_id === this.configService.get('AWS_CLIENT_ID')
        }
        return false;
    }
}