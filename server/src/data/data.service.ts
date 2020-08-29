import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { State } from "./state.schema";
import { Model } from "mongoose";
import {S3} from 'aws-sdk';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
const crypto = require('crypto');


@Injectable()
export class DataService{
    constructor(
        @InjectModel(State.name) private stateModel:Model<State>,
        private configService:ConfigService, 
        private jwtService: JwtService
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

    uploadObjectToBucket(fileExtension, base64Contents, jwt){
        // check that object exists before uploading
        const userId = this.jwtService.decode(jwt)['username'];
        const fileHash = crypto.createHash('sha256').update('a ' +Math.random()).digest('base64').replace(/\//g, '')
        const params = {
            ACL:'public-read',
            Key:`${userId}/${fileHash}.${fileExtension}`,
            Body:Buffer.from(base64Contents, 'base64'),
            Bucket:this.configService.get('AWS_S3_BUCKET')
        };
        return this.s3.upload(params).promise();
    }

    deleteObjectFromBucket(fileName, jwt){
        const userId = this.jwtService.decode(jwt)['username'];

        const params = {
            Bucket:this.configService.get('AWS_S3_BUCKET'),
            Key:`${userId}/${fileName}`
        }

        return this.s3.deleteObject(params).promise();
    }
}