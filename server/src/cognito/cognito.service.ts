import { Injectable } from "@nestjs/common";
import {createHmac} from 'crypto'; 
import {CognitoIdentityServiceProvider} from 'aws-sdk';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CognitoService{
    constructor(private configService:ConfigService){}
    ENV = {
        AWS_SECRET_ACCESS_KEY:this.configService.get('AWS_SECRET_ACCESS_KEY'),
        AWS_ACCESS_KEY_ID:this.configService.get('AWS_ACCESS_KEY_ID'),
        AWS_REGION:this.configService.get('AWS_REGION'),
        AWS_CLIENT_ID:this.configService.get('AWS_CLIENT_ID'),
        AWS_COGNITO_SECRET_HASH:this.configService.get('AWS_COGNITO_SECRET_HASH'),
        AWS_USER_POOL_ID:this.configService.get('AWS_USER_POOL_ID'),
        SERVER_NAME:this.configService.get('SERVER_NAME')
    }
    
    cognito = new CognitoIdentityServiceProvider({
        secretAccessKey: this.ENV.AWS_SECRET_ACCESS_KEY, 
        accessKeyId: this.ENV.AWS_ACCESS_KEY_ID, 
        region: this.ENV.AWS_REGION
    });

    createSecrectHash(username){
        return createHmac('sha256', this.ENV.AWS_COGNITO_SECRET_HASH).update(username + this.ENV.AWS_CLIENT_ID).digest('base64')
    }
    
    formatHeaders(headers){
        let newHeaders = [];
    
        for(const headerName in headers){
            newHeaders.push({
                headerName,
                headerValue: headers[headerName]
            });
        }
    
        return newHeaders;
    }

    callbackToPromise(cognitoMethod, params){
        return new Promise((resolve, reject) => {
            this.cognito[cognitoMethod](params, (error, data) => {
                if(error){
                    reject(error);
                }
                if(data){
                    resolve(data);
                }
            })
        });
    }

    signUp(username, password){
        const params = {
            ClientId: this.ENV.AWS_CLIENT_ID,
            Username: username,
            Password: password,
            SecretHash: this.createSecrectHash(username)
        };

        
        return this.callbackToPromise(
            'signUp', 
            params
        );
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

        return this.callbackToPromise(
            'adminInitiateAuth',
            params
        )
    }

}