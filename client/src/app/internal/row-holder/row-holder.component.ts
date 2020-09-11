import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectRows, selectIsDataSaved, selectBoardCount, selectTaskCount, selectRowCount, selectAppState, selectIsStateLoading } from '../../store/app.selector';
import { addRow, setState, saveChanges } from '../../store/app.actions';
import { MatDialog } from '@angular/material';
import { ArchivedItemsComponent } from '../archived-items/archived-items.component';
import { DomSanitizer } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { createVerificationObject, validateStrict } from '../../../../../shared/verification';
import { appStateTypes, AppStore } from '../../store/app.state';
import { Router } from '@angular/router';
import { Row } from '../../../../../shared/types';

@Component({
    selector:'row-holder',
    templateUrl:'./row-holder.component.html',
    styleUrls:['./row-holder.component.scss']
})

export class RowHolderComponent{
    constructor(private store:Store<AppStore>, private dialog:MatDialog, private sanitization:DomSanitizer, private router:Router){}
    
    rows$:Observable<Row[]> = this.store.select(selectRows);

    rowCount$:Observable<Number> = this.store.select(selectRowCount);
    boardCount$:Observable<Number> = this.store.select(selectBoardCount);
    taskCount$:Observable<Number> = this.store.select(selectTaskCount);

    dataSaved$:Observable<boolean> = this.store.select(selectIsDataSaved);

    isStateLoading$ = this.store.select(selectIsStateLoading);

    addRow(){
        this.store.dispatch(addRow())
    }

    openArchivedItemsDialog(){
        this.dialog.open(ArchivedItemsComponent);
    }


    beginDataExport = false;
    exportData = null;
    
    exportAppState(){
        this.store
            .select(state => state)
            .pipe(first())
            .subscribe(state => {
                let file = new File([JSON.stringify(state)], 'app_state');
        
                let fileReader = new FileReader();

                fileReader.onloadend = (e) => {
                    let untrustedLink:any = fileReader.result;
                    this.exportData = this.sanitization.bypassSecurityTrustUrl(untrustedLink);
                    this.beginDataExport = true;
                }
                if(file){
                    fileReader.readAsDataURL(file);
                }
            })
    }

    downloadLinkLoads(){
        // this seems very hacky, should probably find another way to prevent ExpressionChangedAfter error message
        setTimeout(() => {
            this.beginDataExport = false
        }, 0)
    }

    beginAppStateImport(){
        const el:HTMLButtonElement = document.querySelector('#importAppState');
        el.click();
    }
    importAppState(e){
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onloadend = (e) => {
            let result:any = fileReader.result;
            result = JSON.parse(result);
            validateStrict(createVerificationObject(appStateTypes, result.appReducer));
            this.store.dispatch(setState({state:result}));
        }
        if(file){
            fileReader.readAsText(file)
        }
    }

    toAccountPage(){
        this.router.navigate(['account']);
    }

    saveChanges(){
        this.store.dispatch(saveChanges());
    }

}

