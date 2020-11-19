import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { NgxGustavguezCoreModule } from '@gustavguez/ngx-core';
import { NgxGustavguezApiModule } from '@gustavguez/ngx-api';

import { AuthInterceptor } from './auth.interceptor';
import { NgxGustavguezAuthLoginComponent } from './ngx-gustavguez-auth-login/ngx-gustavguez-auth-login.component';

@NgModule({
	declarations: [NgxGustavguezAuthLoginComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgxWebstorageModule,
		NgxGustavguezCoreModule,
		NgxGustavguezApiModule
	],
	exports: [NgxGustavguezAuthLoginComponent],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		}
	],
})
export class NgxGustavguezAuthModule { }
