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

    currentYear = moment().year();
    yearSelectionValues = [
        this.currentYear,
        this.currentYear + 1,
        this.currentYear + 2,
        this.currentYear + 3,
        this.currentYear + 4
    ]
    selectedYear = this.currentYear;

    months = months;
    currentDayMoment = currentDayMoment;


    selectedMonthIndex=moment().month();
    days=calculateDays(this.selectedYear, this.selectedMonthIndex)
    firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(this.selectedYear, this.selectedMonthIndex)
    dueDateMoment = moment(this.data.dueDate);
    
    yearChange(){
        this.days = calculateDays(this.selectedYear, this.selectedMonthIndex);
        this.firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(this.selectedYear, this.selectedMonthIndex);
        
        if(this.selectedYear === this.currentYear && this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
        if(this.dueDateMoment && this.dueDateMoment.year() === this.selectedYear && this.dueDateMoment.month() === this.selectedMonthIndex){
            this.days[this.dueDateMoment.date()-1] = '#adff2f'
        }
    }
    tabChange(e){
        let state = tabChange(e, this.selectedYear, this.dueDateMoment);
        this.selectedMonthIndex = state.selectedMonthIndex;
        this.days = state.days;
        this.firstDayOfMonthIsoIndex = state.firstDayOfMonthIsoIndex;
    }

    dateSelection(day){
        let state = dateSelection(day, this.selectedYear, this.selectedMonthIndex, this.dueDateMoment, this.data);

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
        this.days=calculateDays(this.selectedYear, this.selectedMonthIndex)
        this.firstDayOfMonthIsoIndex = calculateFirstDayOfMonth(this.selectedYear, this.selectedMonthIndex)

        if(this.selectedMonthIndex === moment().month()){
            this.days[moment().date()-1] ='cyan'
        }
    }

    ngOnInit(){
        this.days[moment().date()-1] ='cyan'
        if(this.dueDateMoment && this.dueDateMoment.year() === this.selectedYear && this.dueDateMoment.month() === this.selectedMonthIndex){
            this.days[this.dueDateMoment.date()-1] = '#adff2f'
        }
    }


}