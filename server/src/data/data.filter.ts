import { InternalServerErrorException, ExceptionFilter, Catch, HttpException, ArgumentsHost } from "@nestjs/common";
import { LoggerService } from "src/logger/logger.service";
import {Request, Response} from 'express';

@Catch(InternalServerErrorException)
export class DataFilter implements ExceptionFilter{
    constructor(private logger: LoggerService){}
    async catch(exception:HttpException, host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = 500

        await this.logger.errorLog({
            ip:request.ip,
            error:JSON.stringify(exception),
            domain:'DATA',
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