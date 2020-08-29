import { Controller, Get, Post, Put, Delete, InternalServerErrorException, HttpCode, UseGuards, Req, Param } from "@nestjs/common";
import { ResponseService } from "src/services/response.service";
import { DataService } from "./data.service";
import { JwtGuard } from "src/guards/jwt.guard";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Controller('api/data')
export class DataController{
    constructor(private dataService:DataService, private responseService:ResponseService, private jwtService: JwtService){}
    
    @UseGuards(JwtGuard)
    @Get('state')
    async getAppState(@Req() req:any){
        try{
            const { jwt } = req.headers;
            const userId = this.jwtService.decode(jwt)['username'];

            return this.responseService.standardMessage(
                await this.dataService.getState(userId)
            );
        }
        catch(e){
            throw new InternalServerErrorException(this.responseService.standardMessage(e, 500));
        }
    }

    @UseGuards(JwtGuard)
    @Post('state')
    @HttpCode(200)
    async postAppState(@Req() req:any){
        try{
            const { jwt } = req.headers;
            const userId = this.jwtService.decode(jwt)['username'];

            return this.responseService.standardMessage(
                await this.dataService.createState({...req.body, userId})
            )
        }
        catch(e){
            throw new InternalServerErrorException(this.responseService.standardMessage(e, 500));
        }
    }
    
    @UseGuards(JwtGuard)
    @Put('state')
    async putAppState(@Req() req:any){
        try{
            const { jwt } = req.headers;
            const userId = this.jwtService.decode(jwt)['username'];

            return this.responseService.standardMessage(
                await this.dataService.updateState(userId, {...req.body, userId})
            )
        }
        catch(e){
            throw new InternalServerErrorException(this.responseService.standardMessage(e, 500));
        }
    }
    
    @UseGuards(JwtGuard)
    @Delete('state')
    async deleteAppState(@Req() req:any){
        try{
            const { jwt } = req.headers;
            const userId = this.jwtService.decode(jwt)['username'];
            return this.responseService.standardMessage(
                await this.dataService.deleteState(userId)
            )
        }
        catch(e){
            throw new InternalServerErrorException(this.responseService.standardMessage(e, 500));
        }
    }

    @UseGuards(JwtGuard)
    @Post('file')
    async uploadFile(@Req() req:any){
        try{
            const {fileName, dataUrl} = req.body;
            const {jwt} = req.headers;

            // if user tries to upload a file with no extension, an error will get thrown
            const splitFileArray = fileName.split('.');
            const fileExtension = splitFileArray[splitFileArray.length -1];

            const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);

            return this.responseService.standardMessage(
                await this.dataService.uploadObjectToBucket(fileExtension, base64, jwt)
            )
        }
        catch(e){
            console.log(e);
            throw new InternalServerErrorException(this.responseService.standardMessage(e, 500));
        }
    }

    @UseGuards(JwtGuard)
    @Delete('file/:file')
    async deleteFile(@Req() req:any, @Param() params){
        try{
            const {jwt} = req.headers;
            const fileName = params.file;

            return this.responseService.standardMessage(
                await this.dataService.deleteObjectFromBucket(fileName, jwt)
            )
        }
        catch(e){
            console.log(e);
            throw new InternalServerErrorException(this.responseService.standardMessage(e, 500));
        }
    }
}