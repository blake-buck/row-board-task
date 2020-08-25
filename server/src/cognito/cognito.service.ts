import { Injectable, UseGuards } from "@nestjs/common";
import {createHmac} from 'crypto'; 
import {CognitoIdentityServiceProvider} from 'aws-sdk';
import { ConfigService } from "@nestjs/config";

import {JwtService} from '@nestjs/jwt';


@Injectable()
export class CognitoService{
    
    constructor(
        private configService:ConfigService, 
        private jwtService: JwtService
    ){}

    private ENV = {
        AWS_SECRET_ACCESS_KEY:this.configService.get('AWS_SECRET_ACCESS_KEY'),
        AWS_ACCESS_KEY_ID:this.configService.get('AWS_ACCESS_KEY_ID'),
        AWS_REGION:this.configService.get('AWS_REGION'),
        AWS_CLIENT_ID:this.configService.get('AWS_CLIENT_ID'),
        AWS_COGNITO_SECRET_HASH:this.configService.get('AWS_COGNITO_SECRET_HASH'),
        AWS_USER_POOL_ID:this.configService.get('AWS_USER_POOL_ID'),
        SERVER_NAME:this.configService.get('SERVER_NAME')
    }
    
    private cognito = new CognitoIdentityServiceProvider({
        secretAccessKey: this.ENV.AWS_SECRET_ACCESS_KEY, 
        accessKeyId: this.ENV.AWS_ACCESS_KEY_ID, 
        region: this.ENV.AWS_REGION
    });

    private getUserIdFromJwt(jwt){
        const decoded = this.jwtService.decode(jwt);
        return decoded['username'];
    }

    private createSecrectHash(username){
        return createHmac('sha256', this.ENV.AWS_COGNITO_SECRET_HASH).update(username + this.ENV.AWS_CLIENT_ID).digest('base64')
    }
    
    private formatHeaders(headers){
        let newHeaders = [];
    
        for(const headerName in headers){
            newHeaders.push({
                headerName,
                headerValue: headers[headerName]
            });
        }
    
        return newHeaders;
    }


    signUp(username, password){
        const params = {
            ClientId: this.ENV.AWS_CLIENT_ID,
            Username: username,
            Password: password,
            SecretHash: this.createSecrectHash(username)
        };

        
        return this.cognito.signUp(params).promise();
    }

    login(username, password, {ip, headers}){
        const params = {
            AuthFlow:   'ADMIN_USER_PASSWORD_AUTH',
            UserPoolId: this.ENV.AWS_USER_POOL_ID,
            ClientId:   this.ENV.AWS_CLIENT_ID,
            
            AuthParameters:{
                USERNAME: username,
                PASSWORD: password,
                SECRET_HASH: this.createSecrectHash(username)
            },
    
            ContextData:{
                IpAddress:   ip,
                ServerName:  this.ENV.SERVER_NAME,
                ServerPath:  '/api/login',
                HttpHeaders: this.formatHeaders(headers)
            }
        }

        return this.cognito.adminInitiateAuth(params).promise();
    }

    
    refreshToken({refresh, headers, ip}){
        console.log('REFRESH ', refresh)
        const params = {
            UserPoolId: this.ENV.AWS_USER_POOL_ID,
            ClientId: this.ENV.AWS_CLIENT_ID,
            AuthFlow:'REFRESH_TOKEN_AUTH',
            
            AuthParameters:{
                REFRESH_TOKEN:refresh,
                SECRET_HASH: this.createSecrectHash(this.getUserIdFromJwt(headers.jwt)),
            },
    
            ContextData:{
                IpAddress:   ip,
                ServerName:  this.ENV.SERVER_NAME,
                ServerPath:  '/api/refresh',
                HttpHeaders: this.formatHeaders(headers)
            }
        };

        return this.cognito.adminInitiateAuth(params).promise();
    }

    
    deleteAccount(jwt){
        const params = {
            AccessToken:jwt
        }

        return this.cognito.deleteUser(params).promise();
    }

    
    changePassword({previousPassword, proposedPassword}, jwt){
        const signOutParams = {
            AccessToken: jwt
        }
        const changePasswordParams = {
            AccessToken: jwt,
            PreviousPassword: previousPassword,
            ProposedPassword: proposedPassword
        }

        return this.cognito.changePassword(changePasswordParams).promise().then(() => this.cognito.globalSignOut(signOutParams).promise())
    }

    forgotPassword(username){
        const params = {
            ClientId: this.ENV.AWS_CLIENT_ID,
            Username: username,
            SecretHash: this.createSecrectHash(username)
        }

        return this.cognito.forgotPassword(params).promise();
    }

    confirmForgotPassword({confirmationCode, username, password}){
        const params = {
            ClientId: this.ENV.AWS_CLIENT_ID,
            ConfirmationCode: confirmationCode,
            Username:username,
            Password:password,
            SecretHash: this.createSecrectHash(username)
        }

        return this.cognito.confirmForgotPassword(params).promise();
    }

}