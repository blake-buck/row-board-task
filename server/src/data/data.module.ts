import { Module } from "@nestjs/common";
import { DataService } from "./data.service";
import { DataController } from "./data.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { State, StateSchema } from "./state.schema";
import { GuardsModule } from "src/guards/guards.module";
import { ResponseService } from "src/services/response.service";
import { JwtModule } from "@nestjs/jwt";
import { LoggerModule } from "src/logger/logger.module";

@Module({
    imports:[
        MongooseModule.forFeature([{name: State.name, schema: StateSchema}]),
        JwtModule.register({}),
        GuardsModule,
        LoggerModule
    ],
    controllers:[
        DataController
    ],
    providers:[
        DataService,
        ResponseService
    ],
    exports:[
        MongooseModule.forFeature([{name: State.name, schema: StateSchema}])
    ]
})

export class DataModule{}