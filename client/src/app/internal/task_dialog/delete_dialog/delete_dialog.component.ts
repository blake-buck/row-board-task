import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { deleteTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';
import { Task } from '../../../../../../shared/types';

@Component({
    templateUrl:'./delete_dialog.component.html',
    selector:'delete-dialog'
})

export class DeleteDialogComponent{
    constructor(
        public dialogRef: MatDialogRef<DeleteDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:Task,
        public dialog:MatDialog,
        private store: Store<AppStore>
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    deleteTask(){
        this.store.dispatch(deleteTask({task:this.data}));
        this.dialog.closeAll();
    }
}