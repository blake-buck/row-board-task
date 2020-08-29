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

    async uploadObjectToBucket(fileExtension, base64Contents, jwt){
        const userId = this.jwtService.decode(jwt)['username'];
        const Bucket = this.configService.get('AWS_S3_BUCKET');

        // check if filename already exists; if it does keep generating to avoid overwriting an existing file
        let continueGeneratingName = false;
        let fileName;
        do{
            fileName = crypto.createHash('sha256').update(userId +Math.random()).digest('base64').replace(/\//g, '');
            const params = {
                Key:`${userId}/${fileName}.${fileExtension}`,
                Bucket
            }

            try{
                const existingFileName = await this.s3.getObject(params).promise();
                continueGeneratingName = true;
            }
            catch(e){
                continueGeneratingName = false
            }

        }
        while(continueGeneratingName);

        const params = {
            ACL:'public-read',
            Key:`${userId}/${fileName}.${fileExtension}`,
            Body:Buffer.from(base64Contents, 'base64'),
            Bucket
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