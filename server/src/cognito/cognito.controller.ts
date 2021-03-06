import { Controller, Get, Post, Put, Delete, Req, HttpCode, BadRequestException, UseGuards, UseFilters } from "@nestjs/common";

import { Request } from 'express';
import { CognitoService } from "./cognito.service";
import { VerificationService } from "../services/verification.service";
import { ResponseService } from "../services/response.service";

import { JwtGuard } from "src/guards/jwt.guard";
import { CognitoRequestFilter } from "./cognito.filter";
import { DataService } from "src/data/data.service";
import { LoggerService } from "src/logger/logger.service";

@Controller('api/auth')
@UseFilters(CognitoRequestFilter)
export class CognitoController{
    constructor(
        private cognitoService:CognitoService, 
        private verificationService: VerificationService,
        private responseService: ResponseService,
        private dataService: DataService,
        private loggerService:LoggerService
    ){}

    @Post('register')
    async register(@Req() req: Request){
        //  disabling this route for the time being
        throw new BadRequestException(this.responseService.standardMessage('Registering has been disabled for the time being. Check with the site owner if you\'d like to provision a user account.', 400));
        const {username, password} = req.body;

        const badRequestStatus = 400;
        if(!this.verificationService.isValidEmail(username)){
            throw new BadRequestException(this.responseService.standardMessage('Invalid Email', badRequestStatus));
        }
        if(!this.verificationService.isValidPassword(password)){
            throw new BadRequestException(this.responseService.standardMessage('Invalid Password', badRequestStatus));
        }

        try{
            await this.cognitoService.signUp(username, password);
            return this.responseService.standardMessage('Check your email for a registration message.');
        }
        catch(e){
            if(e.message === 'An account with the given email already exists.'){
                return this.responseService.standardMessage('Check your email for a registration message.');
            }
            throw new BadRequestException(this.responseService.standardMessage(e, 400));
        }
    }

    @Post('login')
    async login(@Req() req: Request){
        const {username, password} = req.body;
        const badRequestStatus = 400;

        if(!this.verificationService.isValidEmail(username)){
            throw new BadRequestException(this.responseService.standardMessage('Invalid Email', badRequestStatus));
        }

        try{
            const result = await this.cognitoService.login(username, password, req);
            return this.responseService.standardMessage(result);
        }
        catch(e){
            throw new BadRequestException(this.responseService.standardMessage(e, 400))
        }
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request){
        if(!req.headers.jwt){
            throw new BadRequestException(this.responseService.standardMessage('Missing refresh token in request header.', 400));
        }
        try{
            const result = await this.cognitoService.refreshToken({
                refresh: req.body?.refreshToken,
                headers: req.headers,
                ip: req.ip
            });

            return this.responseService.standardMessage(result)
        }
        catch(e){
            throw new BadRequestException(this.responseService.standardMessage(e, 400));
        }
    }

    @UseGuards(JwtGuard)
    @Post('change-password')
    async changePassword(@Req() req: Request){
        try{
            await this.cognitoService.changePassword(req.body, req.headers.jwt)
            return this.responseService.standardMessage('Password is changed.');
        }
        catch(e){
            throw new BadRequestException(this.responseService.standardMessage(e, 400))
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Req() req: Request){
        const {username} = req.body;
        try{
            await this.cognitoService.forgotPassword(username);
            return this.responseService.standardMessage('Check your email for a reset code.');
        }
        catch(e){
            throw new BadRequestException(this.responseService.standardMessage(e, 400));
        }
    }

    @Post('forgot-password/confirm')
    async confirmForgotPassword(@Req() req: Request){
        try{
            await this.cognitoService.confirmForgotPassword(req.body);
            return this.responseService.standardMessage('Your password has been successfully reset');
        }
        catch(e){
            throw new BadRequestException(this.responseService.standardMessage(e, 400));
        }
    }


    @UseGuards(JwtGuard)
    @Delete('delete-account')
    async deleteAccount(@Req() req: Request){
        try{
            await this.cognitoService.deleteAccount(req.headers.jwt);
        }
        catch(e){
            throw new BadRequestException(this.responseService.standardMessage(e, 400));
        }

        try{
            await this.dataService.deleteUserFiles(req.headers.jwt);
        }
        catch(error){
            // If an error occurs while deleting the user's file, log it and move on
            await this.loggerService.errorLog({
                error,
                ip: req.ip,
                route:req.url,
                domain:'DATA',
                timestamp: new Date().toISOString()
            })
        }

        return this.responseService.standardMessage('Your account has been deleted.');
    }

}