import { Component, Input } from '@angular/core';

import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';

import { onDragStart, onDrop } from './row.logic';

import { archiveRow, editRowTitle, editRowDescription, addBoard, transferBoard, editRowExpanded, shiftRowUp, shiftRowDown, deleteRow } from '../../store/app.actions';
import { selectSpecificBoards } from '../../store/app.selector';
import { AppStore } from 'src/app/store/app.state';
import { Row, Board } from '../../../../../shared/types';

@Component({
    templateUrl:'./row.component.html',
    selector:'row',
    styleUrls:['./row.component.css']
})

export class RowComponent{
    @Input() rowData:Row;
    @Input() accordion:any;


    specificBoards$ :Observable<Board[]>;
    boards$ :Observable<Board[]> ;

    isEditingTitle = false;
    isEditingDescription = false;

    canScrollRow = false;

    constructor(private store:Store<AppStore>){}

    ngOnInit(){
        this.boards$ = this.store.pipe(select(selectSpecificBoards, this.rowData.key));
    }
    
    editTitle(e, rowData){
        if(e.key === ' '){
            e.target.value += ' ';
        }
        if(e.key === 'Enter'){
            this.toggleEditTitle();
            this.store.dispatch(editRowTitle({key:rowData.key, title: e.target.value}))
        }
    }
    submitTitle(e, rowData: Row){
        e.preventDefault();
        this.toggleEditTitle();
        this.store.dispatch(editRowTitle({key:rowData.key, title: new FormData(e.target).get('title').toString()}))
    }

    editDescription(e, rowData){
        if(e.key === ' '){
            e.target.value += ' ';
        }
        if(e.key === 'Enter'){
            this.toggleEditDescription();
            this.store.dispatch(editRowDescription({key:rowData.key, description: e.target.value}))
        }
    }
    submitDescription(e, rowData: Row){
        e.preventDefault();
        this.toggleEditDescription();
        this.store.dispatch(editRowDescription({key:rowData.key, description: new FormData(e.target).get('description').toString()}))
    }

    onDragStart = onDragStart

    addBoard(row:Row){
        this.store.dispatch(addBoard({key:row.key}))
    }

    archiveRow(archivedRow:Row){
        this.store.dispatch(archiveRow({archivedRow}))
    }

    toggleEditDescription(){
        this.isEditingDescription = !this.isEditingDescription;
    }

    toggleEditTitle(){
        this.isEditingTitle = !this.isEditingTitle;
    }

    onDrop(e, row:Row){
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

    shiftRowDown(row: Row){
        this.store.dispatch(shiftRowDown({position:row.position}))
    }

    shiftRowUp(row: Row){
        this.store.dispatch(shiftRowUp({position:row.position}))
    }

    deleteRow(row: Row){
        this.store.dispatch(deleteRow({deletedRow:row}))
    }
}