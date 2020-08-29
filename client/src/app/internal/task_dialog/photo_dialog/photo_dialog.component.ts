import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { editTask, uploadTaskPhoto, deleteTaskPhoto } from 'src/app/store/app.actions';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl:'./photo_dialog.component.html',
    styleUrls:['./photo_dialog.component.css'],
    selector:'photo-dialog'
})
export class PhotoDialogComponent{
    
    constructor(
        private store:Store<any>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:any,
        public dialog:MatDialog,
        private http: HttpClient,
        public snackbar: MatSnackBar
    ){}

    realImages = this.data.displayImageUrls;
    canSave = false;
    isLoading = false;
    file;

    getFile(e){
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            this.store.dispatch(
                uploadTaskPhoto({fileName:e.target.files[0].name, dataUrl:fileReader.result, task:this.data})
            );
            this.isLoading = false;
        }
        fileReader.readAsDataURL(e.target.files[0])
        
    }

    onCloseDialog(){
        this.dialogRef.close(); 
    }

    deleteImage(index){
        const fullUrl = this.data.displayImageUrls[index];
        const splitUrl = fullUrl.split('/');
        const fileName = splitUrl[splitUrl.length - 1];

        this.store.dispatch(deleteTaskPhoto({fileName, task:this.data, fullUrl}));
        this.realImages = this.realImages.filter(url => url !== fullUrl);
    }
}
