import { Module } from "@nestjs/common";
import { CognitoService } from "./cognito.service";
import { CognitoController } from "./cognito.controller";

import {ResponseService} from '../services/response.service';
import {VerificationService} from '../services/verification.service';
import { GuardsModule } from "src/guards/guards.module";
import { JwtModule } from "@nestjs/jwt";
import { LoggerModule } from "src/logger/logger.module";
import { DataService } from "src/data/data.service";
import { DataModule } from "src/data/data.module";

@Module({
    imports:[
        GuardsModule,
        JwtModule.register({}),
        LoggerModule,
        DataModule
    ],
    controllers:[CognitoController],
    providers:[
        CognitoService,
        ResponseService,
        VerificationService,
        DataService
    ]
})
export class CognitoModule{}