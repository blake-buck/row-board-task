import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { PhotoDialogComponent } from '../photo_dialog/photo_dialog.component';
import { uploadTaskAttachment, deleteTaskAttachment } from 'src/app/store/app.actions';

@Component({
    templateUrl:'./attachment_dialog.component.html',
    selector:'attachment-dialog',
    styleUrls:['./attachment_dialog.component.css']
})

export class AttachmentDialogComponent{
    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog
    ){}
    
    attachedFiles = [...this.data.attachedFiles];

    downloadLink = null;
    unsavedDownloads = [];
    
    isLoading = false;
    canSave = false;

    getFile(e){
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            this.store.dispatch(
                uploadTaskAttachment({fileName:e.target.files[e.target.files.length-1].name, dataUrl:fileReader.result, task:this.data})
            );
            this.attachedFiles.push({name: e.target.files[e.target.files.length-1].name, link:''})
            this.isLoading = false;
        }
        fileReader.readAsDataURL(e.target.files[e.target.files.length - 1])
        
    }

    removeFile(index){
        const file = this.attachedFiles[index];
        this.store.dispatch(deleteTaskAttachment({fileName:file.name, task: this.data, fullUrl:file.link}));
    }

    onCloseDialog(){
        this.dialogRef.close();
    }
}