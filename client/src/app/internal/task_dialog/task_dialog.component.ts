import {Component, ViewChild, ElementRef, Inject} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Store, select } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { PreviewAttachmentDialogComponent} from './preview_attachment_dialog/preview_attachment_dialog.component';
import {AttachmentDialogComponent} from './attachment_dialog/attachment_dialog.component';
import {DatePickDialogComponent} from './date_pick_dialog/date_pick_dialog.component';
import {PhotoDialogComponent} from './photo_dialog/photo_dialog.component';
import {DeleteDialogComponent} from './delete_dialog/delete_dialog.component';

import {TransferTaskDialogComponent} from './transfer_task_dialog/transfer_task_dialog.component';
import { addLabel, addComment, addChecklist, deleteChecklist, changeChecklistTitle, toggleEditChecklistTitle, toggleChecklistItem, toggleEditChecklistItem, addChecklistItem, deleteChecklistItem, changeChecklistItemText, removeFile, deleteComment } from './task_dialog.logic';
import { editTask, closeTaskDialog, openTaskDialog, setSelectedTask, archiveTask } from 'src/app/store/app.actions';
import { selectBoardAndRowTitleFromTaskKey, selectSpecificTask, selectSelectedTask } from 'src/app/store/app.selector';
import { Observable } from 'rxjs';
import { LinkTaskDialogComponent } from './link_task_dialog/link_task_dialog.component';
import { HttpClient } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import { AppStore } from 'src/app/store/app.state';

import * as moment from 'moment';

@Component({
    selector:'task-dialog',
    templateUrl:'task_dialog.component.html',
    styleUrls:['./task_dialog.component.css']
})

export class TaskDialogComponent {

    isEditingBody = false;
    isEditingBodyFocused = false;

    isEditingDescription = false;
    isEditingDescriptionFocused = false;

    boardAndRowTitle$:Observable<{rowTitle:string, boardTitle:string}>;
    linkedTasks$ = [];

    data$;

    moment = moment;

    constructor(
        private store:Store<AppStore>,
        public dialog:MatDialog,
        public http:HttpClient
        ){}

        ngOnInit(){
            this.data$ = this.store.select(selectSelectedTask);
            this.store.pipe(
                select(selectSelectedTask),
                first(),
                map(val => val)
            ).subscribe(data => {
                this.boardAndRowTitle$ = this.store.select(selectBoardAndRowTitleFromTaskKey, data.boardKey)
                document.querySelector('#pageTitle').textContent = data.body
                document.querySelector('.cdk-global-overlay-wrapper:last-of-type').classList.add('dialogToBack')
            })
        }

        ngOnDestroy(){
            setTimeout(() => {
                if(!document.querySelector('.task-dialog')){
                    document.querySelector('#pageTitle').textContent = 'AngularFundamentals'
                }
            }, 500)
        }
    
    addLabel(labelColor, data){
        this.store.dispatch(editTask({task:addLabel(data, labelColor)}))
    }

    toggleInput(isEditing, isFocused, e, data){
        if(e){
            e.preventDefault();
        }

        if(this[isEditing]){
            this.store.dispatch(editTask({task:data}));
            this[isEditing] = false
            this[isFocused] = false;
        }
        else{
            this[isEditing] = true
        }
    }
    
    onCloseDialog(data){
        this.store.dispatch(closeTaskDialog())
    }

    changeTaskProperty(property, value, delayDispatch, data){
        data[property] = value;
        if(!delayDispatch){
            this.store.dispatch(editTask({task:data}));
        }
    }
    
    openTaskDialog(value){
        this.store.dispatch(openTaskDialog());
        this.store.dispatch(setSelectedTask({task:value}))
    }


    openDialog(id, dialogData, taskData){
        let dialogComponent;
        switch(id){
            case 'delete-dialog':
                dialogComponent = DeleteDialogComponent;
                break;

            case 'date-pick-dialog':
                dialogComponent = DatePickDialogComponent;
                break;

            case 'photo-dialog':
                dialogComponent = PhotoDialogComponent;
                break;

            case 'attachment-dialog':
                dialogComponent = AttachmentDialogComponent;
                break;

            case 'preview-attachment-dialog':
                dialogComponent = PreviewAttachmentDialogComponent;
                break;

            case 'transfer-task-dialog':
                dialogComponent = TransferTaskDialogComponent;
                break;
            
            case 'link_task_dialog':
                dialogComponent = LinkTaskDialogComponent;
                break;
        }
        this.dialog.open(
            dialogComponent,
            {
                id,
                data: dialogData ? dialogData : taskData
            }
        );
    }

    removeFile(index, data){
        this.store.dispatch(editTask({task:removeFile(index, data)}))
    }

    getLinkedTaskInfo(taskKey:number, boardKey:number, index){
        return this.store.pipe(select(selectSpecificTask, ({taskKey, boardKey})))
    }


    archiveTask(data){
        this.store.dispatch(archiveTask({task:data}));
        this.dialog.closeAll();
    }

}