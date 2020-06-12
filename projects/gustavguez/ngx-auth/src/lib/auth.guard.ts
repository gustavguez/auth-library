
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {

	constructor(
		private authService: AuthService) { }

	canActivate(): boolean {
		// Active user session?
		if (this.authService.isLogged()) {
			return true;
		}

		// Redirect login form
		this.authService.checkAndNotifyMeState();
		return false;
	}
}
