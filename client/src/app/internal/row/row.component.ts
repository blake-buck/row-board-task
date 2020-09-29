import { Component, Input, ViewChild, ElementRef, ViewChildren } from '@angular/core';

import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import { onDragStart, onDragOver, onDrop } from './row.logic';

import { archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard, scrollRowForward, scrollRowBackward, editRowExpanded, shiftRowUp, shiftRowDown, deleteRow } from '../../store/app.actions';
import { selectSpecificBoards } from '../../store/app.selector';
import { Actions } from '@ngrx/effects';
import { AppStore } from 'src/app/store/app.state';
import { Row, Board } from '../../../../../shared/types';
import { BoardListComponent } from './board-list/board-list.component';

@Component({
    templateUrl:'./row.component.html',
    selector:'row',
    styleUrls:['./row.component.css']
})

export class RowComponent{
    @Input() rowData:Row;
    @Input() accordion:any;


    specificBoards$;
    boards$ :Observable<Board[]> ;

    isEditingTitle = false;
    isEditingDescription = false;

    canScrollRow = false;

    constructor(private store:Store<AppStore>, private actions$:Actions){}

    ngOnInit(){
        this.boards$ = this.store.pipe(select(selectSpecificBoards, this.rowData.key));
    }

    onMouseEnter(e){
        e.preventDefault();
        this.canScrollRow = true;
    }
    onMouseLeave(e){
        e.preventDefault();
        this.canScrollRow = false;
    }
    
    editTitle(e, rowData){
        if(e.key === ' '){
            e.target.value += ' ';
        }
    }
    submitTitle(e, rowData){
        e.preventDefault();
        this.toggleEditTitle(rowData);
        this.store.dispatch(editRowTitle({key:rowData.key, title: new FormData(e.target).get('title').toString()}))

    }

    editDescription(e, rowData){
        console.log(e.key)
        if(e.key === ' '){
            e.target.value += ' ';
        }
    }
    submitDescription(e, rowData){
        e.preventDefault();
        this.toggleEditDescription(rowData);
        this.store.dispatch(editRowDescription({key:rowData.key, description: new FormData(e.target).get('description').toString()}))
    }

    onDragStart = onDragStart
    onDragOver = onDragOver

    addBoard(row){
        this.store.dispatch(addBoard({key:row.key}))
    }

    archiveRow(archivedRow){
        this.store.dispatch(archiveRow({archivedRow}))
    }

    toggleEditDescription(row){
        if(this.isEditingDescription){}
        this.isEditingDescription = !this.isEditingDescription;
    }

    toggleEditTitle(row){
        this.isEditingTitle = !this.isEditingTitle;
    }

    onDrop(e, row){
        let payload = onDrop(e, row);
        if(payload){
          this.store.dispatch(transferBoard({payload}));
        }
    }

    openRow(){
        if(!this.rowData.expanded){
            this.store.dispatch(editRowExpanded({key:this.rowData.key, expanded:true}));
        }
    }

    closeRow(){
        if(this.rowData.expanded){
            this.store.dispatch(editRowExpanded({key:this.rowData.key, expanded:false}));
        }
    }

    shiftRowDown(row){
        this.store.dispatch(shiftRowDown({position:row.position}))
    }

    shiftRowUp(row){
        this.store.dispatch(shiftRowUp({position:row.position}))
    }

    deleteRow(row){
        this.store.dispatch(deleteRow({deletedRow:row}))
    }
}