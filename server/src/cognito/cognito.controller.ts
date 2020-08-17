import { Controller, Get, Post, Put, Delete, Req, HttpCode, Res } from "@nestjs/common";

import { Request, Response } from 'express';
import { CognitoService } from "./cognito.service";
import { VerificationService } from "../services/verification.service";
import { ResponseService } from "../services/response.service";

@Controller('api/auth')
export class CognitoController{
    constructor(
        private cognitoService:CognitoService, 
        private verificationService: VerificationService,
        private responseService: ResponseService
    ){}

    @Post('register')
    async register(@Req() req: Request, @Res() res: Response){
        const {username, password} = req.body;

        const badRequestStatus = 400;
        if(!this.verificationService.isValidEmail(username)){
            return res.status(badRequestStatus).send(this.responseService.standardMessage('Invalid Email', badRequestStatus));
        }
        if(!this.verificationService.isValidPassword(password)){
            return res.status(badRequestStatus).send(this.responseService.standardMessage('Invalid Password', badRequestStatus));
        }

        try{
            const result:any = await this.cognitoService.signUp(username, password);
            const userId = result.UserSub;

            return res.send(this.responseService.standardMessage('Check your email for a registration message.'));
        }
        catch(e){
            console.log('ERROR ', e)
            if(e.message === 'An account with the given email already exists.'){
                return res.send(this.responseService.standardMessage('Check your email for a registration message.'));
            }
            return res.status(badRequestStatus).send(this.responseService.standardMessage(e.message, badRequestStatus));
        }
    
    }
}