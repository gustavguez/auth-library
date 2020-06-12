import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxGustavguezCoreModule } from '@gustavguez/ngx-core';

import { AuthInterceptor } from './auth.interceptor';
import { NgxGustavguezAuthLoginComponent } from './ngx-gustavguez-auth-login/ngx-gustavguez-auth-login.component';

@NgModule({
	declarations: [NgxGustavguezAuthLoginComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		LocalStorageModule,
		NgxGustavguezCoreModule
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
