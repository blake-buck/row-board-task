import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { uploadTaskPhoto, deleteTaskPhoto } from 'src/app/store/app.actions';
import { selectSelectedTask } from 'src/app/store/app.selector';
import { AppStore } from 'src/app/store/app.state';
import { Task } from '../../../../../../shared/types';

@Component({
    templateUrl:'./photo_dialog.component.html',
    styleUrls:['./photo_dialog.component.css'],
    selector:'photo-dialog'
})
export class PhotoDialogComponent{
    
    constructor(
        private store:Store<AppStore>,
        public dialogRef: MatDialogRef<PhotoDialogComponent>, 
    ){}
    data$ = this.store.select(selectSelectedTask);
    isLoading = false;

    getFile(e, task:Task){
        this.isLoading = true;
        let fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            this.store.dispatch(
                uploadTaskPhoto({fileName:e.target.files[0].name, dataUrl:fileReader.result, task})
            );
            this.isLoading = false;
        }

        fileReader.readAsDataURL(e.target.files[0])
    }

    onCloseDialog(){
        this.dialogRef.close(); 
    }

    deleteImage(index, task:Task){
        const fullUrl = task.displayImageUrls[index];
        const splitUrl = fullUrl.split('/');
        const fileName = splitUrl[splitUrl.length - 1];

        this.store.dispatch(deleteTaskPhoto({fileName, task, fullUrl}));
    }
}
