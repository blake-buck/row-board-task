import {Component, Input, Output, EventEmitter, Injectable} from '@angular/core';
import { MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';

import {Observable} from 'rxjs';

import {orderByLastEdited, orderByAlphabetical, orderByDateCreated, onDrop, orderByCompletion, reverseList} from './board.logic';
import {editBoardTitle, archiveBoard, toggleHideCompleteTasks, addTask, editTask, reorderBoardTasks} from '../../store/app.actions'
import { selectBoardFromBoardKey } from '../../store/app.selector';
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
    orderByCompletion = orderByCompletion;
    reverseList = reverseList;
    
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

    archiveBoard(board:Board){
        this.store.dispatch(archiveBoard({key:board.key}))
    }

    addTask(){
        this.store.dispatch(addTask({key:this.boardKey}))
    }

    onTaskChange(changedTask:Task){
        this.store.dispatch(editTask({task:changedTask}))
    }

    toggleEditBoardTitle(board:Board){
        if(this.isEditingBoardTitle){
            this.store.dispatch(editBoardTitle({key:board.key, title:board.title}))
        }
        this.isEditingBoardTitle = !this.isEditingBoardTitle;

        if(this.isEditingBoardTitleFocused){
            this.isEditingBoardTitleFocused = false;
        }
    }
    
    editBoardTitle(e, board:Board){  
        if(e.code === 'Enter'){
            this.toggleEditBoardTitle(board)
        }
        else{
            board.title = e.target.value;
        }
    }

    toggleHideCompleteTasks(key:number, hideCompleteTasks:boolean){
        this.store.dispatch(toggleHideCompleteTasks({key, hideCompleteTasks}))
    }
   
    onDragStart(e, board:Board){
        if(!e.dataTransfer.getData('text').includes('+')){
            e.dataTransfer.setData('text/plain', `BOARD${board.key}-${board.rowKey}`);
        }        
    }

    onDrop(e, board:Board){
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

    onDragOver(e){
        e.preventDefault()
    }


    openDialog(id, data:Task | number){
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

    orderTasksBy(orderBy, tasks:Task[], key:number){
        this.store.dispatch(reorderBoardTasks({payload:{key, tasks:orderBy(tasks)}}))
    }
    
}