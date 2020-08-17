import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseService{
    standardMessage(message, status=200){
        return {message, status};
    }
}