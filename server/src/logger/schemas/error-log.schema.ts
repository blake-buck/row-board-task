import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Ip } from "@nestjs/common";

@Schema()
export class ErrorLog extends Document{
    @Prop()
    error:string;

    @Prop()
    domain: string;

    @Prop()
    route: string;

    @Prop()
    timestamp: string;

    @Prop()
    ip: string;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);