import { Module } from "@nestjs/common";
import { CognitoService } from "./cognito.service";
import { CognitoController } from "./cognito.controller";

import {ResponseService} from '../services/response.service';
import {VerificationService} from '../services/verification.service';

@Module({
    imports:[],
    controllers:[CognitoController],
    providers:[
        CognitoService,
        ResponseService,
        VerificationService
    ]
})
export class CognitoModule{}