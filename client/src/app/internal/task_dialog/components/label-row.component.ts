import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { editTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';

@Component({
    selector:'label-row',
    template:`
    <div class='label-row'>
        <p class='label' *ngFor='let label of data.labels; index as i' style ='font-weight:bold; color:white' [style.background]='label.background'>
            <input maxlength='20' [value]='label.text' [style.background]='label.background' [size]='label.text.length > 1 ? label.text.length-1 : 1' (keyup)='changeLabelContent($event, label, data)' (focusout)='saveLabelContent(data)'/>
            <mat-icon (click)='removeLabel(i, data)'>clear</mat-icon>
        </p>
    </div>
    `,
    styleUrls:['../task_dialog.component.css']
})

export class LabelRowComponent{
    @Input() data;
    
    constructor(private store:Store<AppStore>){}
    
    changeLabelContent(e, label){
        label.text = e.target.value
    }

    saveLabelContent(data){
        this.store.dispatch(editTask({task:data}))
    }

    removeLabel(i, data){
        data.labels.splice(i, 1);
        this.store.dispatch(editTask({task:data}))        
    }
}