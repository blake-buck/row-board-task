import { Component, Input } from '@angular/core';
import { Task } from '../../../../../../shared/types';

@Component({
    selector:'icon-row',
    template:`
        <div>
            <mat-icon *ngIf='data.important'>visibility</mat-icon>
            <mat-icon *ngIf='data.warning'>warning</mat-icon>
            <mat-icon *ngIf='data.payment'>payment</mat-icon>
            <mat-icon *ngIf='data.vacation'>weekend</mat-icon>
            <mat-icon *ngIf='data.attachment'>attach_file</mat-icon>
            <mat-icon *ngIf='data.social'>group</mat-icon>
            <mat-icon *ngIf='data.work'>work</mat-icon>
            <mat-icon *ngIf='data.travel'>local_airport</mat-icon>
        </div>
    `,
    styleUrls:['../task_dialog.component.css']
})

export class IconRowComponent{
    @Input() data:Task;
}