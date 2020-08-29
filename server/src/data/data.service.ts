import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { State } from "./state.schema";
import { Model } from "mongoose";

@Injectable()

export class DataService{
    constructor(@InjectModel(State.name) private stateModel:Model<State>){}

    getState(userId){
        return this.stateModel.findOne({userId}).exec();
    }

    createState(stateObj){
        return new this.stateModel(stateObj).save();
    }

    updateState(userId, updatedState){
        return this.stateModel.findOneAndUpdate({userId}, {...updatedState}).exec();
    }

    deleteState(userId){
        return this.stateModel.findOneAndDelete({userId}).exec();
    }
}