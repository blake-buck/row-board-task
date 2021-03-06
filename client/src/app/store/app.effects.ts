import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { first, map, mergeMap} from 'rxjs/operators'
import { Store } from '@ngrx/store';
import { selectAppState } from './app.selector';
import { combineLatest } from 'rxjs';
import { openTaskDialog, closeTaskDialog, login, loginSuccess, forgotPassword, confirmForgotPassword, changePassword, deleteAccount, retrieveStateFromDb, initializeDbState, retrieveStateFromDbSuccess, saveChanges, uploadTaskPhoto, editTask, deleteTaskPhoto, uploadTaskAttachment, deleteTaskAttachment } from './app.actions';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TaskDialogComponent } from '../internal/task_dialog/task_dialog.component';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { Task } from '../../../../shared/types';
import { AppStore } from './app.state';

export type ApiResult = {
    message:any,
    status:number
}

@Injectable()
export class AppEffects {
    constructor(
        private actions$:Actions, 
        private store:Store<AppStore>, 
        public dialog:MatDialog, 
        private service: AppService,
        private router: Router,
        private snackbar: MatSnackBar
    ){}

    openTaskDialog$ = createEffect(
        () => this.actions$.pipe(
            ofType(openTaskDialog),
            map(() => {
                this.dialog.closeAll();
                this.dialog.open(TaskDialogComponent, 
                    {
                        panelClass:'task-dialog'
                    }
                )
            })
        ),
        {dispatch: false}
    );
    
    closeTaskDialog$ = createEffect(
        () => this.actions$.pipe(
            ofType(closeTaskDialog),
            map(() => {
                this.dialog.closeAll();
            })
        ),
        {dispatch: false}
    )


    login$ = createEffect(
        () => this.actions$.pipe(
            ofType(login),
            mergeMap((action) => this.service.login(action.formValue)),
            map((result:ApiResult) => {
                this.service.addTokensToStorage({
                    refreshToken:result.message.AuthenticationResult.RefreshToken,
                    accessToken: result.message.AuthenticationResult.AccessToken
                });
                this.store.dispatch(loginSuccess());
                this.router.navigate(['app']);
            })
        ),
        {dispatch: false}
    )

    forgotPassword$ = createEffect(
        () => this.actions$.pipe(
            ofType(forgotPassword),
            mergeMap(action => this.service.forgotPassword(action.formValue.username)),
            map((result:ApiResult) => {
                this.router.navigate(['forgot-password', 'confirm']);
            })
        ),
        {dispatch: false}
    )
    
    confirmForgotPassword$ = createEffect(
        () => this.actions$.pipe(
            ofType(confirmForgotPassword),
            mergeMap(action => this.service.confirmForgotPassword(action.formValue)),
            map((result: ApiResult) => {
                this.snackbar.open('Your password has been successfully reset.', 'CLOSE');
                this.router.navigate(['']);
            })
        ),
        {dispatch: false}
    )

    changePassword$ = createEffect(
        () => this.actions$.pipe(
            ofType(changePassword),
            mergeMap(action => this.service.changePassword(action.formValue)),
            map(() => {
                this.snackbar.open('Your password has been sucessfully changed.', 'CLOSE');
            })
        ),
        {dispatch: false}
    )

    deleteAccount$ = createEffect(
        () => this.actions$.pipe(
            ofType(deleteAccount),
            mergeMap(action => this.service.deleteDbState()),
            mergeMap(action => this.service.deleteAccount()),
            map(() => {
                this.snackbar.open('Your account has been succesfully deleted', 'CLOSE');
                this.router.navigate(['']);
            })
        ),
        {dispatch: false}
    )

    retrieveState$ = createEffect(
        () => this.actions$.pipe(
            ofType(retrieveStateFromDb),
            mergeMap(action => this.service.retrieveStateFromDb()),
            map((result:ApiResult) => {
                if(result.message){
                    this.store.dispatch(retrieveStateFromDbSuccess({storedState:result.message}))
                }
                else{
                    this.store.dispatch(initializeDbState());
                }
            })
        ),
        {dispatch: false}
    )

    initializeDbState$ = createEffect(
        () => this.actions$.pipe(
            ofType(initializeDbState),
            mergeMap(action => this.service.initializeDbState()),
            map((result) => result)
        ),
        {dispatch: false}
    )

    updateDbState$ = createEffect(
        () => this.actions$.pipe(
            ofType(saveChanges),
            mergeMap((action) => this.store.select(selectAppState).pipe(first())),
            mergeMap(appState => this.service.updateDbState(appState)),
            map(result =>  console.log(result))
        ),
        { dispatch: false }
    )

    uploadTaskPhoto$ = createEffect(
        () => this.actions$.pipe(
            ofType(uploadTaskPhoto),
            // not sure how i feel about the approach to this problem, but it works for now
            map(action => {
                return combineLatest(this.service.uploadFile(action.fileName, action.dataUrl), [action.task])
            }),
            mergeMap(result => result),
            map((result:[ApiResult, Task]) => {
                
                const fileLocation = result[0].message.Location;
                const task = result[1];

                this.store.dispatch(editTask({
                    task:{
                        ...task,
                        displayImageUrls:[...task.displayImageUrls, fileLocation]
                    }
                }));
                this.store.dispatch(saveChanges());
            })
        ),
        {dispatch: false}
    );

    deleteTaskPhoto$ = createEffect(
        () => this.actions$.pipe(
            ofType(deleteTaskPhoto),
            map(action => {
                return combineLatest(this.service.deleteFile(action.fileName), [action.task], [action.fullUrl])
            }),
            mergeMap(result => result),
            map((result:[ApiResult, Task, string]) => {

                const task = result[1];
                const fullUrl = result[2];

                this.store.dispatch(editTask({
                    task:{
                        ...task, 
                        displayImageUrls: task.displayImageUrls.filter(url => url !== fullUrl)
                    }
                }))
                this.store.dispatch(saveChanges());

            })
        ),
        {dispatch: false}
    )

    uploadTaskAttachment$ = createEffect(
        () => this.actions$.pipe(
            ofType(uploadTaskAttachment),
            // not sure how i feel about the approach to this problem, but it works for now
            map(action => {
                return combineLatest(this.service.uploadFile(action.fileName, action.dataUrl), [action])
            }),
            mergeMap(result => result),
            map((result:[ApiResult, any]) => {
                
                const fileLocation = result[0].message.Location;
                const task = result[1].task;

                this.store.dispatch(editTask({
                    task:{
                        ...task,
                        attachedFiles:[...task.attachedFiles, {name: result[1].fileName, link:fileLocation}],
                        attachment:true
                    }
                }));

                this.store.dispatch(saveChanges());
            })
        ),
        {dispatch: false}
    );

    deleteTaskAttachment$ = createEffect(
        () => this.actions$.pipe(
            ofType(deleteTaskAttachment),
            map(action => {
                return combineLatest(this.service.deleteFile(action.fileName), [action.task], [action.fullUrl])
            }),
            mergeMap(result => result),
            map((result:[ApiResult, any, string]) => {

                const task = result[1];
                const fullUrl = result[2];

                task.attachedFiles = task.attachedFiles.filter(file => file.link !== fullUrl);
                if(task.attachedFiles.length === 0){
                    task.attachment = false;
                }
                
                this.store.dispatch(editTask({
                    task
                }))
                this.store.dispatch(saveChanges());

            })
        ),
        {dispatch: false}
    );

}