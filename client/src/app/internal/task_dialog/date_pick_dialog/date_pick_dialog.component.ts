import * as moment from 'moment';
import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { months, currentDayMoment, calculateDays, calculateFirstDayOfMonth, tabChange, dateSelection } from './date_pick_dialog.logic';
import { editTask } from 'src/app/store/app.actions';
import { AppStore } from 'src/app/store/app.state';
import { Task } from '../../../../../../shared/types';

@Component({
    templateUrl:'./date_pick_dialog.component.html',
    selector:'date-pick-dialog',
    styleUrls:['./date_pick_dialog.component.css']
})

export class DatePickDialogComponent{
    constructor(
        private store:Store<AppStore>,
        public dialogRef: MatDialogRef<DatePickDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) public data:Task,
        public dialog:MatDialog
    ){}

    months = months;
    currentDayMoment = currentDayMoment;


    selectedMonthIndex=moment().month();
    days=calculateDays(this.selectedMonthIndex)
    firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(this.selectedMonthIndex)
    dueDateMoment = moment(this.data.dueDate);
    
    
    tabChange(e){
        let state = tabChange(e, this.dueDateMoment);
        this.selectedMonthIndex = state.selectedMonthIndex;
        this.days = state.days;
        this.firstDayOfMonthIsoIndex = state.firstDayOfMonthIsoIndex;
    }

    dateSelection(day){
        console.log('DATE SELECTION ', this.data.dueDate)
        let state = dateSelection(day, this.selectedMonthIndex, this.dueDateMoment, this.data);

        if(state.days){
            this.days = state.days;
        }
        if(state.data.dueDate){
            this.dueDateMoment = state.data.dueDate;
        }

        this.store.dispatch(editTask({task:this.data}));
    }

    closeDialog(){
        this.dialogRef.close();
    }

    removeDueDate(){
        this.data.dueDate = null;
        this.dueDateMoment = null;
        this.store.dispatch(editTask({task:this.data}))
        this.days=calculateDays(this.selectedMonthIndex)
        this.firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(this.selectedMonthIndex)

        if(this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
    }

    ngOnInit(){
        this.days[moment().date()-1] ='cyan'
        if(this.dueDateMoment && this.dueDateMoment.month() === this.selectedMonthIndex){
            this.days[this.dueDateMoment.date()-1] = '#adff2f'
        }
    }


}