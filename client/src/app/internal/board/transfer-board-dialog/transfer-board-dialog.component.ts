import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { selectRows, selectBoards } from 'src/app/store/app.selector';
import { Row, Board } from '../../../../../../shared/types';
import { AppStore } from 'src/app/store/app.state';

@Component({
    templateUrl:'./transfer_board_dialog.component.html',
    selector:'transfer-board-dialog'
})

export class TransferBoardDialogComponent{

    rows$:Observable<Row[]>
    boards$;
    selectedRow = null;

    constructor(
        private store:Store<AppStore>,
        public dialogRef: MatDialogRef<TransferBoardDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:Board,
        public dialog:MatDialog
    ){
        this.rows$ = this.store.select(selectRows)
        this.boards$ = this.store.select(selectBoards)
    }

    onCloseDialog(){
        this.dialogRef.close();
    }

    transferBoard(data){
        this.store.dispatch({type:'TRANSFER_BOARD', payload:{draggedBoardKey:data.key, draggedBoardRowKey:data.rowKey, droppedOnRowKey:this.selectedRow.key}})
        this.dialogRef.close();
    }

}