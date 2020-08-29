import { Module } from "@nestjs/common";
import { DataService } from "./data.service";
import { DataController } from "./data.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { State, StateSchema } from "./state.schema";
import { GuardsModule } from "src/guards/guards.module";
import { ResponseService } from "src/services/response.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[
        MongooseModule.forFeature([{name: State.name, schema: StateSchema}]),
        JwtModule.register({}),
        GuardsModule
    ],
    controllers:[
        DataController
    ],
    providers:[
        DataService,
        ResponseService
    ]
})

export class DataModule{}