import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { State } from "./state.schema";
import { Model } from "mongoose";
import {S3} from 'aws-sdk';
import { ConfigService } from "@nestjs/config";
const crypto = require('crypto');


@Injectable()
export class DataService{
    constructor(
        @InjectModel(State.name) private stateModel:Model<State>,
        private configService:ConfigService, 
    ){}

    private s3 = new S3({
        accessKeyId:this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey:this.configService.get('AWS_SECRET_ACCESS_KEY'),
        region: this.configService.get('AWS_REGION')
    });

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

    uploadObjectToBucket(fileExtension, base64Contents){
        // check that object exists before uploading
        const fileHash = crypto.createHash('sha256').update('a ' +Math.random()).digest('base64').replace(/\//g, '')
        const params = {
            ACL:'public-read',
            Key:`${fileHash}.${fileExtension}`,
            Body:Buffer.from(base64Contents, 'base64'),
            Bucket:this.configService.get('AWS_S3_BUCKET')
        };
        return this.s3.upload(params).promise();
    }

    deleteObjectFromBucket(fileName){
        const params = {
            Bucket:this.configService.get('AWS_S3_BUCKET'),
            Key:fileName
        }

        return this.s3.deleteObject(params).promise();
    }
}