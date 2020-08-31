import { InjectModel } from "@nestjs/mongoose";
import { ErrorLog } from ".//schemas/error-log.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

type ErrorDomain = 'COGNITO' | 'DATA' | 'GENERAL';
type ErrorLogObj = {
    error: string;
    domain: ErrorDomain;
    route: string;
    timestamp: string;
    ip: string;
}

@Injectable()
export class LoggerService{
    constructor(@InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLog>){}

    errorLog(errorLog: ErrorLogObj){
        const newLog = new this.errorLogModel(errorLog);
        return newLog.save();
    }
}