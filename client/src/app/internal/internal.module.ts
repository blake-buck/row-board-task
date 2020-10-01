import { NgModule } from '@angular/core';
import { RowComponent } from './row/row.component';
import { BoardComponent } from './board/board.component';
import { ExportButtonComponent } from './row-holder/export-button/export-button.component';
import { DeleteBoardDialogComponent } from './board/delete-board-dialog/delete-board-dialog.component';
import { TransferBoardDialogComponent } from './board/transfer-board-dialog/transfer-board-dialog.component';
import { TaskComponent } from './task/task.component';
import { TaskDialogComponent } from './task_dialog/task_dialog.component';
import { DeleteDialogComponent } from './task_dialog/delete_dialog/delete_dialog.component';
import { DatePickDialogComponent } from './task_dialog/date_pick_dialog/date_pick_dialog.component';
import { PhotoDialogComponent } from './task_dialog/photo_dialog/photo_dialog.component';
import { AttachmentDialogComponent } from './task_dialog/attachment_dialog/attachment_dialog.component';
import { TransferTaskDialogComponent } from './task_dialog/transfer_task_dialog/transfer_task_dialog.component';
import { PreviewAttachmentDialogComponent } from './task_dialog/preview_attachment_dialog/preview_attachment_dialog.component';
import { LinkTaskDialogComponent } from './task_dialog/link_task_dialog/link_task_dialog.component';
import { RowHolderComponent } from './row-holder/row-holder.component';
import { ArchivedItemsComponent } from './archived-items/archived-items.component';
import { RestoreBoardDialogComponent } from './archived-items/restore-board-dialog/restore-board-dialog.component';
import { RestoreTaskDialogComponent } from './archived-items/restore-task-dialog/restore-task-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatListModule, MatDividerModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatDialogModule, MatGridListModule, MatSelectModule, MatMenuModule, MatCheckboxModule, MatTabsModule, MatIconModule, MatExpansionModule, MatToolbarModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { AccountComponent } from './account/account.component';
import { InputAutofocusDirective } from './util/input-autofocus.directive';
import { BoardListComponent } from './row/board-list/board-list.component';
import { MomentPipe } from './util/moment.pipe';
import { LabelRowComponent } from './task_dialog/components/label-row.component';
import { IconRowComponent } from './task_dialog/components/icon-row.component';
import { DialogDescriptionComponent } from './task_dialog/components/dialog-description.component';
import { DialogCommentsComponent } from './task_dialog/components/dialog-comments/dialog-comments.component';
import { DialogChecklistComponent } from './task_dialog/components/dialog-checklist/dialog-checklist.component';
import { DialogTitleComponent } from './task_dialog/components/dialog-title.component';


@NgModule({
    declarations: [
        RowComponent,
        BoardListComponent,
    
        BoardComponent,
        ExportButtonComponent,
        DeleteBoardDialogComponent,
        TransferBoardDialogComponent,
    
        TaskComponent,

        TaskDialogComponent,
        LabelRowComponent,
        IconRowComponent,
        DialogDescriptionComponent,
        DialogCommentsComponent,
        DialogChecklistComponent,
        DialogTitleComponent,

        DeleteDialogComponent,
        DatePickDialogComponent,
        PhotoDialogComponent, 
        AttachmentDialogComponent,
        TransferTaskDialogComponent,
        PreviewAttachmentDialogComponent,
        LinkTaskDialogComponent,
    
        RowHolderComponent,
        ArchivedItemsComponent,
        RestoreBoardDialogComponent,
        RestoreTaskDialogComponent,

        AccountComponent,

        InputAutofocusDirective,
        MomentPipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDialogModule,
        MatGridListModule,
        MatSelectModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTabsModule,
        MatIconModule,
        MatExpansionModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
    
        HttpClientModule,
    
        AppRoutingModule,

        EffectsModule.forRoot([RowComponent])
    ],
    entryComponents : [
        TaskDialogComponent, 
        DeleteDialogComponent, 
        DatePickDialogComponent, 
        PhotoDialogComponent, 
        AttachmentDialogComponent, 
        DeleteBoardDialogComponent, 
        TransferTaskDialogComponent, 
        TransferBoardDialogComponent, 
        PreviewAttachmentDialogComponent, 
        LinkTaskDialogComponent, 
        ArchivedItemsComponent,
        RestoreBoardDialogComponent,
        RestoreTaskDialogComponent
    ]
})

export class InternalModule {}