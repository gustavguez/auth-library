import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxGustavguezCoreModule} from '@gustavguez/ngx-core';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { NgxGustavguezAuthModule } from '../../projects/gustavguez/ngx-auth/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
	AppRoutingModule,
	HttpClientModule,
	NgxWebstorageModule.forRoot({
		prefix: 'ngx-gustavguez-auth-module',
		separator: '.'
	}),
	NgxGustavguezCoreModule,
	NgxGustavguezAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
