import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap} from 'rxjs/operators'
import { Store } from '@ngrx/store';
import { selectAppState } from './app.selector';
import { combineLatest } from 'rxjs';
import { editRowTitle, editRowTitleSuccess, openTaskDialog, closeTaskDialog, login, loginSuccess, forgotPassword, confirmForgotPassword, changePassword, deleteAccount, retrieveStateFromDb, initializeDbState, retrieveStateFromDbSuccess, saveChanges, uploadTaskPhoto } from './app.actions';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TaskDialogComponent } from '../internal/task_dialog/task_dialog.component';
import { AppService } from './app.service';
import { Router } from '@angular/router';

type ApiResult = {
    message:any,
    status:number
}
@Injectable()

export class AppEffects {
    constructor(
        private actions$:Actions, 
        private store:Store<any>, 
        public dialog:MatDialog, 
        private service: AppService,
        private router: Router,
        private snackbar: MatSnackBar
    ){}

    editRowTitle$ = createEffect(
        () => this.actions$.pipe(
            ofType(editRowTitle),
            map(action => {
                let appState = this.store.select(selectAppState)
                return combineLatest(appState, [action])
            }),
            map(payload => {
                payload.subscribe(val => {
                    let state = val[0]
                    let clonedRows = [...state.rows]
                    let index = clonedRows.findIndex(row => row.key === val[1].key)
                    let modifiedRow = {...clonedRows[index], title:val[1].title}
                    clonedRows.splice(index, 1, {...modifiedRow})
                    this.store.dispatch(editRowTitleSuccess({rows:clonedRows}))
                }).unsubscribe()
                
            })
        ),
        {dispatch:false}
    )

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
            map((result:any) => {
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
            map(result => {
                this.router.navigate(['forgot-password', 'confirm']);
            })
        ),
        {dispatch: false}
    )
    
    confirmForgotPassword$ = createEffect(
        () => this.actions$.pipe(
            ofType(confirmForgotPassword),
            mergeMap(action => this.service.confirmForgotPassword(action.formValue)),
            map(result => {
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
                console.log('RESULT ', result)
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
            map((result) => {
                console.log('INITIALIZE ', result);
            })
        ),
        {dispatch: false}
    )

    updateDbState$ = createEffect(
        () => this.actions$.pipe(
            ofType(saveChanges),
            mergeMap(action => this.service.updateDbState(action.appState)),
            map(result => console.log('update db state ', result))
        ),
        { dispatch: false }
    )

    uploadTaskPhoto$ = createEffect(
        () => this.actions$.pipe(
            ofType(uploadTaskPhoto),
            mergeMap(action => this.service.uploadFile(action.fileName, action.dataUrl)),
            map(result => console.log('UPLOAD RESULT ', result))
        ),
        {dispatch: false}
    )
}