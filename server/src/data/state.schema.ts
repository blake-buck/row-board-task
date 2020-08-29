import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class State extends Document{
    @Prop()
    userId: string;
    
    @Prop()
    currentTaskKey:number;

    @Prop()
    currentBoardKey:number;

    @Prop()
    currentRowKey:number;

    @Prop()
    archivedRows:any[];

    @Prop()
    rows:any[];

    @Prop()
    archivedBoards:any[];

    @Prop()
    archivedTasks:any[];

    @Prop()
    boards:any[];

    @Prop()
    rowCount:number;

    @Prop()
    boardCount:number;

    @Prop()
    taskCount:number;
}

export const StateSchema = SchemaFactory.createForClass(State);