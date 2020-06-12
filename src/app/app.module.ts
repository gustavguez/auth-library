import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxGustavguezCoreModule} from '@gustavguez/ngx-core';
import { LocalStorageModule } from 'angular-2-local-storage';

import { NgxGustavguezAuthModule } from 'projects/gustavguez/ngx-auth/src/lib';

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
	LocalStorageModule.forRoot({
		prefix: 'ngx-gustavguez-auth-module',
		storageType: 'localStorage'
	}),
	NgxGustavguezCoreModule,
	NgxGustavguezAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
