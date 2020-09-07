import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { deleteBoard } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';

@Component({
    templateUrl:'./delete-board-dialog.component.html',
    selector:'delete-board-dialog'
})

export class DeleteBoardDialogComponent{
    constructor(
        private store:Store<AppStore>,
        public dialogRef: MatDialogRef<DeleteBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:number,
        public dialog:MatDialog
    ){}

    onCloseDialog(){
        this.dialogRef.close();
    }

    deleteBoard(){
        this.store.dispatch(deleteBoard({key:this.data}))
        this.dialogRef.close();
    }
}