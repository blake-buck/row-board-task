import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ErrorLog, ErrorLogSchema } from "./schemas/error-log.schema";
import {LoggerService} from './logger.service';

@Module({
    imports:[
        MongooseModule.forFeature([{name:ErrorLog.name, schema:ErrorLogSchema}])
    ],
    providers:[
        LoggerService
    ],
    exports:[
        MongooseModule,
        LoggerService
    ]
})
export class LoggerModule{}