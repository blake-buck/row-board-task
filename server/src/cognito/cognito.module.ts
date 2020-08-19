import { Module } from "@nestjs/common";
import { CognitoService } from "./cognito.service";
import { CognitoController } from "./cognito.controller";

import {ResponseService} from '../services/response.service';
import {VerificationService} from '../services/verification.service';
import { GuardsModule } from "src/guards/guards.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[
        GuardsModule,
        JwtModule.register({})
    ],
    controllers:[CognitoController],
    providers:[
        CognitoService,
        ResponseService,
        VerificationService
    ]
})
export class CognitoModule{}