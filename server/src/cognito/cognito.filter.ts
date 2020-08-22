import { Catch, BadRequestException, ExceptionFilter, HttpException, ArgumentsHost } from "@nestjs/common";
import { Request, Response } from 'express';
import { LoggerService } from "src/logger/logger.service";

@Catch(BadRequestException)
export class CognitoRequestFilter implements ExceptionFilter{
    constructor(private logger: LoggerService){}
    async catch(exception:HttpException, host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = 400

        await this.logger.errorLog({
            ip:request.ip,
            error:JSON.stringify(exception),
            domain:'COGNITO',
            route:request.url,
            timestamp: new Date().toISOString()
        });
        
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message:exception.message
            });
    }
}