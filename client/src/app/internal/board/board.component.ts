import {Component, Input, Output, EventEmitter, Injectable, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
import {Store, select} from '@ngrx/store';

import {Observable} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import {orderByLastEdited, orderByAlphabetical, orderByDateCreated, onDrop} from './board.logic';
import {editBoardTitle, archiveBoard, deleteBoard, toggleHideCompleteTasks, addTask, editTask, reorderBoardTasks, duplicateBoard, scrollRowForward, scrollRowBackward} from '../../store/app.actions'
import { selectRows, selectBoards, selectBoardFromBoardKey } from '../../store/app.selector';
import { TransferBoardDialogComponent } from './transfer-board-dialog/transfer-board-dialog.component';
import { DeleteBoardDialogComponent } from './delete-board-dialog/delete-board-dialog.component';
import { Task, Board } from '../../../../../shared/types';
import { AppStore } from 'src/app/store/app.state';


@Component({
    selector:'board',
    templateUrl:'board.component.html',
    styleUrls:['./board.component.css']
})

@Injectable()

export class BoardComponent{
    orderByAlphabetical=orderByAlphabetical;
    orderByDateCreated=orderByDateCreated;
    orderByLastEdited=orderByLastEdited;
    
    @Input() boardTitle:string;
    @Input() boardKey:number;

    @Output() autoScroller = new EventEmitter();

    isEditingBoardTitle = false;
    isEditingBoardTitleFocused = false;
    
    tasks$:Observable<Task[]>
    board$:Observable<Board>


    constructor(private store:Store<AppStore>, public dialog:MatDialog){}

    ngOnInit(){
        this.board$ = this.store.select(selectBoardFromBoardKey, this.boardKey)
    }

    archiveBoard(board){
        this.store.dispatch(archiveBoard({key:board.key}))
    }

    addTask(){
        this.store.dispatch(addTask({key:this.boardKey}))
    }

    onTaskChange(changedTask){
        this.store.dispatch(editTask({task:changedTask}))
    }

    toggleEditBoardTitle(board){
        if(this.isEditingBoardTitle){
            this.store.dispatch(editBoardTitle({key:board.key, title:board.title}))
        }
        this.isEditingBoardTitle = !this.isEditingBoardTitle;

        if(this.isEditingBoardTitleFocused){
            this.isEditingBoardTitleFocused = false;
        }
    }
    
    editBoardTitle(e, board){  
        if(e.code === 'Enter'){
            this.toggleEditBoardTitle(board)
        }
        else{
            board.title = e.target.value;
        }
    }

    toggleHideCompleteTasks(key, hideCompleteTasks){
        this.store.dispatch(toggleHideCompleteTasks({key, hideCompleteTasks}))
    }
   
    onDragStart(e, board){
        if(!e.dataTransfer.getData('text').includes('+')){
            e.dataTransfer.setData('text/plain', `BOARD${board.key}-${board.rowKey}`);
        }        
    }

    onDrop(e, board){
        e.preventDefault();
        let eventDataTransfer = e.dataTransfer.getData('text')
        
        let state = onDrop(eventDataTransfer, board, this.boardKey);

        if(state){
            this.store.dispatch({type:state.type, payload:state.payload})
        }
    }

    taskAutoScroll(e){
        this.autoScroller.emit({forward:true, offset:e.clientX})
    }

    onDragOver(e, board){
        e.preventDefault()
    }


    openDialog(id, data){
        let component;
        switch(id){
            case 'delete-board-dialog':
                component = DeleteBoardDialogComponent;
                break;
            case 'transfer-board-dialog':
                component = TransferBoardDialogComponent;
                break;
        }


        this.dialog.open(
            component,
            {
                id, 
                data
            }
        );
    }

    orderTasksBy(orderBy, tasks, key){
        this.store.dispatch(reorderBoardTasks({payload:{key, tasks:orderBy(tasks)}}))
    }
    
}