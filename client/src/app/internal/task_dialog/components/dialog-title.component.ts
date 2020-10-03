import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { editTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';

@Component({
    selector:'dialog-title',
    template:`
        <div class='dialog-body' *ngIf='!isEditingBody' (click)='toggleInput(data)'>
            <h1 [ngClass]='{"complete":data.isComplete}'>{{data.body}}</h1>
            
            <h1 *ngIf='!data.body' style='opacity:.7;'>Card Title...</h1>
        </div>

        <form (submit)='toggleInput(data)' *ngIf='isEditingBody'>
            <mat-form-field style='width:100%;'>
                    <input style='font-size:2em; font-weight: bold; width:100%;' input-autofocus matInput (focusout)='toggleInput(data)' [value]='data.body' (keyup)='editBody($event)'/>
            </mat-form-field>
        </form>
    `,
    styleUrls:['../task_dialog.component.css']
})

export class DialogTitleComponent{
    @Input() data;
    constructor(private store:Store<AppStore>){}
    
    isEditingBody = false;
    toggleInput(data){
        if(this.isEditingBody){
            this.store.dispatch(editTask({task:data}))
        }
        this.isEditingBody = !this.isEditingBody;
    }

    editBody(e){
        this.data.body = e.target.value;
    }
}