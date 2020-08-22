import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ErrorLog extends Document{
    @Prop()
    error:string;

    @Prop()
    domain: string;

    @Prop()
    route: string;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);