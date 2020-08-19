import { JwtGuard } from "./jwt.guard";
import {JwtModule} from '@nestjs/jwt'
import { Module } from "@nestjs/common";

const jwkToPem = require('jwk-to-pem');
const jwk = require('../../jwks.json');

@Module({
    imports:[
        JwtModule.register({
            secret: jwkToPem(jwk.keys[1])
        })
    ],
    providers:[
        JwtGuard
    ],
    exports:[
        JwtGuard
    ]
})

export class GuardsModule {}