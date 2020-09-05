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
        @InjectModel(State.name) public stateModel:Model<State>,
        private configService:ConfigService, 
        private jwtService: JwtService
    ){}

    private s3 = new S3({
        accessKeyId:this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey:this.configService.get('AWS_SECRET_ACCESS_KEY'),
        region: this.configService.get('AWS_REGION')
    });

    private generateFileName(userId){
        return crypto.createHash('sha256').update(userId + Math.random()).digest('base64').replace(/\//g, '');
    }

    private async generateUniqueFileName(userId, fileExtension, Bucket){
        // check if filename already exists; if it does keep generating to avoid overwriting an existing file
        let continueGeneratingName = false;
        let fileName;
        do{
            fileName = this.generateFileName(userId);
            const params = {
                Key:`${userId}/${fileName}.${fileExtension}`,
                Bucket
            }

            try{
                // throws an error if object doesn't exist
                const existingFileNameCheck = await this.s3.getObject(params).promise();
                continueGeneratingName = true;
            }
            catch(e){
                continueGeneratingName = false
            }

        }
        while(continueGeneratingName);

        return fileName;
    }

    // MongoDB routes

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

    // S3 Routes

    async uploadObjectToBucket(fileExtension, base64Contents, jwt){
        const userId = this.jwtService.decode(jwt)['username'];
        const Bucket = this.configService.get('AWS_S3_BUCKET');

        const fileName = await this.generateUniqueFileName(userId, fileExtension, Bucket);

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

    listAllUserFiles(jwt){
        const userId = this.jwtService.decode(jwt)['username'];
        const Bucket = this.configService.get('AWS_S3_BUCKET');

        const params = {
            Bucket,
            Prefix: userId
        }
        
        return this.s3.listObjects(params).promise();
    }

    async deleteUserFiles(jwt){
        const Bucket = this.configService.get('AWS_S3_BUCKET');

        const fileListResult = await this.listAllUserFiles(jwt);
        const Objects = fileListResult.Contents.map(object => ({Key: object.Key}));

        const params = {
            Bucket,
            Delete:{
                Objects
            }
        }

        return this.s3.deleteObjects(params).promise();
    }
}