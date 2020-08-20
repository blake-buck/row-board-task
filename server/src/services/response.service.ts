import { Injectable } from "@nestjs/common";

// used to create standardized server responses
@Injectable()
export class ResponseService{
    standardMessage(message, status=200){
        return {message, status};
    }
}