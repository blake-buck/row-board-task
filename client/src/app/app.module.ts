import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import {appReducer} from './store/app.reducer'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import 
{ 
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} 
from '@angular/material';

import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { AppEffects } from './store/app.effects';
import { EffectsModule } from '@ngrx/effects';
import { AppErrorHandler } from './error-handler.service';
import { AppService } from './store/app.service';
import { HeadersInterceptor } from './headers-interceptor';
import { PublicFacingModule } from './public-facing/public-facing.module';
import { InternalModule } from './internal/internal.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    StoreModule.forRoot({appReducer}),
    EffectsModule.forRoot([AppEffects]),
   
    MatProgressSpinnerModule,
    MatTooltipModule,

    HttpClientModule,

    AppRoutingModule,

    PublicFacingModule,
    InternalModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue:{hasBackdrop:false}},
    {provide: ErrorHandler, useClass:AppErrorHandler},
    AppService,
    {provide: HTTP_INTERCEPTORS, useClass:HeadersInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
