import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PhotoDialogComponent } from '../photo_dialog/photo_dialog.component';
import { uploadTaskAttachment, deleteTaskAttachment } from 'src/app/store/app.actions';
import { selectSelectedTask } from 'src/app/store/app.selector';
import { AppStore } from 'src/app/store/app.state';


@Component({
    templateUrl:'./attachment_dialog.component.html',
    selector:'attachment-dialog',
    styleUrls:['./attachment_dialog.component.css']
})

export class AttachmentDialogComponent{
    constructor(
        private store:Store<AppStore>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
    ){}

    data$ = this.store.select(selectSelectedTask);    
    isLoading = false;

    getFile(e, task){
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            this.store.dispatch(
                uploadTaskAttachment({fileName:e.target.files[e.target.files.length-1].name, dataUrl:fileReader.result, task})
            );
            this.isLoading = false;
        }
        fileReader.readAsDataURL(e.target.files[e.target.files.length - 1])
        
    }

    removeFile(index, task){
        const file = task.attachedFiles[index];
        this.store.dispatch(deleteTaskAttachment({fileName:file.name, task, fullUrl:file.link}));
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}