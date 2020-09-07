import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { retrieveStateFromDb, getState } from '../store/app.actions';
import { AppStore } from '../store/app.state';

@Injectable({
    providedIn:'root'
})

export class DatabaseSyncGuard implements CanActivate{
    constructor(private store:Store<AppStore>){}

    canActivate(){
        // initialize state in app
        this.store.dispatch(getState())
        // retrieve state from DB
        this.store.dispatch(retrieveStateFromDb());
        return true
    }
}