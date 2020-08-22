import { InjectModel } from "@nestjs/mongoose";
import { ErrorLog } from ".//schemas/error-log.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

type ErrorDomain = 'COGNITO' | 'GENERAL';

@Injectable()
export class LoggerService{
    constructor(@InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLog>){}

    errorLog(error, domain:ErrorDomain, route:string){
        const newLog = new this.errorLogModel({
            error: JSON.stringify(error),
            domain,
            route
        })
        return newLog.save();
    }
}