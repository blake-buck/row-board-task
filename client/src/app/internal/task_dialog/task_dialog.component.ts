import {Component} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material';

import { PreviewAttachmentDialogComponent} from './preview_attachment_dialog/preview_attachment_dialog.component';
import {AttachmentDialogComponent} from './attachment_dialog/attachment_dialog.component';
import {DatePickDialogComponent} from './date_pick_dialog/date_pick_dialog.component';
import {PhotoDialogComponent} from './photo_dialog/photo_dialog.component';
import {DeleteDialogComponent} from './delete_dialog/delete_dialog.component';

import {TransferTaskDialogComponent} from './transfer_task_dialog/transfer_task_dialog.component';
import { addChecklist, addLabel, removeFile } from './task_dialog.logic';
import { editTask, closeTaskDialog, openTaskDialog, setSelectedTask, archiveTask } from 'src/app/store/app.actions';
import { selectBoardAndRowTitleFromTaskKey, selectSpecificTask, selectSelectedTask } from 'src/app/store/app.selector';
import { Observable } from 'rxjs';
import { LinkTaskDialogComponent } from './link_task_dialog/link_task_dialog.component';
import { HttpClient } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import { AppStore } from 'src/app/store/app.state';
import { Task } from '../../../../../shared/types';

const dialogHashMap = {
    'delete-dialog': DeleteDialogComponent,
    'date-pick-dialog': DatePickDialogComponent,
    'photo-dialog': PhotoDialogComponent,
    'attachment-dialog': AttachmentDialogComponent,
    'preview-attachment-dialog': PreviewAttachmentDialogComponent,
    'transfer-task-dialog': TransferTaskDialogComponent,
    'link_task_dialog': LinkTaskDialogComponent
};


@Component({
    selector:'task-dialog',
    templateUrl:'task_dialog.component.html',
    styleUrls:['./task_dialog.component.css']
})

export class TaskDialogComponent {

    boardAndRowTitle$:Observable<{rowTitle:string, boardTitle:string}>;
    linkedTasks$ = [];

    data$;

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
    
    addLabel(labelColor, data:Task){
        this.store.dispatch(editTask({task:addLabel(data, labelColor)}))
    }

    addChecklist(data: Task){
        this.store.dispatch(editTask({task:addChecklist(data)}))
    }

    onCloseDialog(){
        this.store.dispatch(closeTaskDialog())
    }

    changeTaskProperty(property, value, delayDispatch, data:Task){
        data[property] = value;
        if(!delayDispatch){
            this.store.dispatch(editTask({task:data}));
        }
    }
    
    openTaskDialog(value){
        this.store.dispatch(openTaskDialog());
        this.store.dispatch(setSelectedTask({task:value}))
    }


    openDialog(id, dialogData, taskData:Task){
        const dialogComponent = dialogHashMap[id];
        
        this.dialog.open(
            dialogComponent,
            {
                id,
                data: dialogData ? dialogData : taskData
            }
        );
    }

    removeFile(index, data:Task){
        this.store.dispatch(editTask({task:removeFile(index, data)}))
    }

    getLinkedTaskInfo(taskKey:number, boardKey:number){
        return this.store.pipe(select(selectSpecificTask, ({taskKey, boardKey})))
    }


    archiveTask(data:Task){
        this.store.dispatch(archiveTask({task:data}));
        this.dialog.closeAll();
    }

}