import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import { MatDialog} from '@angular/material';

import {addCompletionStyling, onDrop, labelLength, cyclePhoto} from './task.logic';

import { editTask, transferTask, scrollRowForward, scrollRowBackward, setSelectedTask, openTaskDialog } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';
import { Task, Board } from '../../../../../shared/types';


type LocalTask = Task & {isInput: boolean};


@Component({
    selector:'task',
    templateUrl:'task.component.html',
    styleUrls:['./task.component.css']
})


export class TaskComponent{
    @ViewChild('elementWrapper', {read: ElementRef, static:false}) elementWrapper: ElementRef;

    @Input() task:LocalTask;
    @Input() board:Board;

    @Output() taskTransfer = new EventEmitter();
    @Output() taskChange   = new EventEmitter();
    
    @Output() autoScroller = new EventEmitter();

    isTaskTitleInputFocused = false;
    displayLabelText = false;
    disableDialogOpening = false;

    currentDisplayPhoto = 0;
    classAddedToList = false

    constructor(private store:Store<AppStore>, public dialog:MatDialog){}

    ngOnInit(){
        if(this.task.isEditing){
            this.task.isInput = true; 
        }
    }

    ngAfterViewChecked(){
        if(this.task.displayImageUrls.length === 1){   
            setTimeout(() => {
                this.currentDisplayPhoto = 0;
            }, 0)
        }
    }

    disableDialogOpen(){
        this.disableDialogOpening = true;
        setTimeout(() => {
            this.disableDialogOpening = false;
        }, 500)
    }

    openDialog(){
        if(!this.disableDialogOpening){
            this.store.dispatch(openTaskDialog());
            this.store.dispatch(setSelectedTask({task:this.task}));
        }
    }

    toggleInput(e?){
        if(e){
            e.preventDefault();
        }
        if(!this.task.isComplete){
            if(this.task.isInput){
                this.isTaskTitleInputFocused = false;
                this.task.isEditing= false;
            }
            this.task.isInput = !this.task.isInput;
            this.store.dispatch(editTask({task:this.task}))    
        }
        
    }

    changeTaskBody(e){
        if(e.code === 'Enter'){
            e.preventDefault()
            this.toggleInput()
        }
        else{
            this.task.body = e.target.value; 
        }
    }

    toggleDisplayLabelText(){
        this.disableDialogOpen()
        this.displayLabelText = !this.displayLabelText;  
    }

    cyclePhoto(isForward, displayImageUrls){
        this.disableDialogOpen()
        this.currentDisplayPhoto = cyclePhoto(isForward, displayImageUrls, this.currentDisplayPhoto)
    }

    focusLabel(){
        this.disableDialogOpen()
    }

    labelLength = labelLength;

    changeLabelText(e, labelIndex, task){
        this.labelLength(e.target.value.length)
        task.labels[labelIndex].text = e.target.value;
    }

    onDrop(e){
        e.preventDefault();
        let transferedData = e.dataTransfer.getData('text');

        let droppedAbove = false;
        if(e.layerY < (this.elementWrapper.nativeElement.offsetHeight /2)){
            droppedAbove = true;
        }

        let payload = onDrop(transferedData, this.task, droppedAbove)
        if(payload){
            this.store.dispatch(transferTask({payload}))
        }
                
    }

    onDragOver(e){
    }

    onDragStart(e){
        e.dataTransfer.setData('text/plain', `${this.task.key}+${this.task.boardKey}`);
    }

    onDragEnd(e){
        e.preventDefault()
    }
    
    addCompletionStyling(property){
        return addCompletionStyling(property, this.task)
    }

}