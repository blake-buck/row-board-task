import { ErrorHandler } from "@angular/core";
import {MatSnackBar} from '@angular/material/snack-bar';

export class AppErrorHandler implements ErrorHandler{
    constructor(private snackbar:MatSnackBar){}

    handleError(e){
        console.error(e);
        let errorMessage;
        if(e.error){
            errorMessage = e.error.message;
        }
        else if(e.message){
            errorMessage = e.message;
        }
        else{
            errorMessage = e;
        }
        this.snackbar.open(
            `Error: ${errorMessage}`, 
            'CLOSE',
            {
                verticalPosition:'top',
                horizontalPosition:'right'
            }
        );
    }

}