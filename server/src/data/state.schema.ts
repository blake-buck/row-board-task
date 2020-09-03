import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Row, Board, Task } from '../../../shared/types';

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
    archivedRows:Row[];

    @Prop()
    rows:Row[];

    @Prop()
    archivedBoards:Board[];

    @Prop()
    archivedTasks:Task[];

    @Prop()
    boards:Board[];

    @Prop()
    rowCount:number;

    @Prop()
    boardCount:number;

    @Prop()
    taskCount:number;
}

export const StateSchema = SchemaFactory.createForClass(State);