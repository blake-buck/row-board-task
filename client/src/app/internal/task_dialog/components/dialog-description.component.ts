import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { editTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';
import { Task } from '../../../../../../shared/types';

@Component({
    selector:'dialog-description',
    template:`
        <div class='dialog-description'>
            <div class='rowAndBoard'>
                <p>Row:   {{boardAndRowTitle.rowTitle}}</p>
                <p>Board: {{boardAndRowTitle.boardTitle}}</p>
            </div>
            
            <div class='dialog-description-title'>
                <h3>Description</h3>
                <button mat-icon-button (click)='toggleInput(data)'>
                    <mat-icon>edit</mat-icon>
                </button>
            </div>
            
            <p *ngIf='!isEditingDescription'>{{data.description}}</p>
            <mat-form-field *ngIf='isEditingDescription'>
                <textarea input-autofocus matInput (focusout)='toggleInput(data)' (keyup)='changeDescription($event)' cdkTextareaAutosize #autosize="cdkTextareaAutosize" cdkAutosizeMinRows="4" [value]='data.description'></textarea>
            </mat-form-field>
        </div>
    `,
    styleUrls:['../task_dialog.component.css']
})

export class DialogDescriptionComponent{
    @ViewChild('autosize', {static:false}) autosize:CdkTextareaAutosize;
    
    @Input() data;
    @Input() boardAndRowTitle;

    constructor(private store:Store<AppStore>){}
    
    isEditingDescription = false;
    toggleInput(data:Task){
        if(this.isEditingDescription){
            this.store.dispatch(editTask({task:data}));
        }
        this.isEditingDescription = !this.isEditingDescription;
    }

    changeDescription(e){
        this.data.description = e.target.value;
    }
}