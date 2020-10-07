import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { editTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';
import { Task } from '../../../../../../../shared/types';
import { addChecklist, deleteChecklist, toggleEditChecklistTitle, changeChecklistTitle, toggleChecklistItem, toggleEditChecklistItem, addChecklistItem, deleteChecklistItem, changeChecklistItemText } from '../../task_dialog.logic';

@Component({
    selector:'dialog-checklist',
    templateUrl:'./dialog-checklist.component.html',
    styleUrls:['../../task_dialog.component.css']
})

export class DialogChecklistComponent{
    @Input() data;

    constructor(private store:Store<AppStore>){}

    deleteChecklist(checklist, data: Task){
        this.store.dispatch(editTask({task:deleteChecklist(data, checklist)}))
    }

    toggleEditChecklistTitle(checklistKey, data: Task){
        let result = toggleEditChecklistTitle(checklistKey, data)

        if(!result.isEditing){
            this.store.dispatch(editTask({task:result.data}))
        }
    }
    changeChecklistTitle(e, checklistKey, data: Task){
        changeChecklistTitle(e.target.value, data, checklistKey);
    }

    onChecklistItemDragStart(e, item){
        e.dataTransfer.setData('text/plain', `{"itemKey":${item.key}, "checklistKey":${item.checklistKey}}`);
    }

    onChecklistItemDragOver(e){
        e.preventDefault();
    }

    onChecklistDrop(e, item, data: Task){
        let droppedItemKeys = JSON.parse(e.dataTransfer.getData('text/plain'))
        if(droppedItemKeys.checklistKey === item.checklistKey){
            let modifiedChecklist = data.checklists.find(checklist => checklist.key === droppedItemKeys.checklistKey).content;
            let droppedItemIndex = modifiedChecklist.findIndex(item => droppedItemKeys.itemKey === item.key);
            let droppedOnItemIndex = modifiedChecklist.findIndex(val => val.key === item.key);
            let droppedItem = modifiedChecklist.splice(droppedItemIndex, 1);
            modifiedChecklist.splice(droppedOnItemIndex, 0, droppedItem[0]);

            this.store.dispatch(editTask({task:data}));
        }
    }


    toggleChecklistItem(e, checklistKey, item, data: Task){
        let result = toggleChecklistItem(checklistKey, item, data);
        if(result){
            this.store.dispatch(editTask({task:result}))
        }
    }

    toggleEditChecklistItem(e, checklistKey, item, data: Task){
        let result = toggleEditChecklistItem(checklistKey, item, data)
        
        if(!result.isEditing){
            this.store.dispatch(editTask({task:result.data}))
        }
    }

    addChecklistItem(checklistKey, data: Task){
        this.store.dispatch(editTask({task:addChecklistItem(checklistKey, data)}))
    }
    
    changeChecklistItem(e, checklistKey, index, data: Task, item){

        if(e.code === 'Delete'){ 
            this.store.dispatch(editTask({task:deleteChecklistItem(checklistKey, index, data)}))          
        }
        else if(e.code === 'Enter' && e.target.value !== ''){
            this.toggleEditChecklistItem(e, checklistKey, item, data)
        }
        else{
            // TODO: add debounce
            this.store.dispatch(editTask({task: changeChecklistItemText(checklistKey, index, e.target.value, data)}))
        }
    }
}